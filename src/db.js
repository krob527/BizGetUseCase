import Database from 'better-sqlite3';

const db = new Database('data.db');

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS business_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    purpose TEXT NOT NULL,
    team_size INTEGER NOT NULL,
    locations_json TEXT NOT NULL,
    long_term_goal TEXT NOT NULL,
    short_term_goal_1 TEXT NOT NULL,
    short_term_goal_2 TEXT NOT NULL,
    short_term_goal_3 TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_newsletter_sent_at TEXT
  );

  CREATE TABLE IF NOT EXISTS newsletters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES business_profiles(id)
  );
`);

export function upsertBusinessProfile(profile) {
  const now = new Date().toISOString();

  const existing = db
    .prepare('SELECT id FROM business_profiles WHERE email = ?')
    .get(profile.email.trim().toLowerCase());

  const payload = {
    owner_name: profile.ownerName.trim(),
    business_name: profile.businessName.trim(),
    email: profile.email.trim().toLowerCase(),
    purpose: profile.purpose.trim(),
    team_size: Number(profile.teamSize),
    locations_json: JSON.stringify(profile.locations),
    long_term_goal: profile.longTermGoal.trim(),
    short_term_goal_1: profile.shortTermGoals[0].trim(),
    short_term_goal_2: profile.shortTermGoals[1].trim(),
    short_term_goal_3: profile.shortTermGoals[2].trim()
  };

  if (existing) {
    db.prepare(
      `
      UPDATE business_profiles
      SET owner_name = @owner_name,
          business_name = @business_name,
          purpose = @purpose,
          team_size = @team_size,
          locations_json = @locations_json,
          long_term_goal = @long_term_goal,
          short_term_goal_1 = @short_term_goal_1,
          short_term_goal_2 = @short_term_goal_2,
          short_term_goal_3 = @short_term_goal_3,
          updated_at = @updated_at
      WHERE email = @email
      `
    ).run({ ...payload, updated_at: now });

    return db
      .prepare('SELECT * FROM business_profiles WHERE email = ?')
      .get(payload.email);
  }

  db.prepare(
    `
    INSERT INTO business_profiles (
      owner_name,
      business_name,
      email,
      purpose,
      team_size,
      locations_json,
      long_term_goal,
      short_term_goal_1,
      short_term_goal_2,
      short_term_goal_3,
      created_at,
      updated_at
    )
    VALUES (
      @owner_name,
      @business_name,
      @email,
      @purpose,
      @team_size,
      @locations_json,
      @long_term_goal,
      @short_term_goal_1,
      @short_term_goal_2,
      @short_term_goal_3,
      @created_at,
      @updated_at
    )
    `
  ).run({ ...payload, created_at: now, updated_at: now });

  return db
    .prepare('SELECT * FROM business_profiles WHERE email = ?')
    .get(payload.email);
}

export function getAllProfiles() {
  return db.prepare('SELECT * FROM business_profiles ORDER BY created_at DESC').all();
}

export function saveNewsletter(profileId, subject, bodyHtml, bodyText) {
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO newsletters (profile_id, subject, body_html, body_text, created_at)
    VALUES (?, ?, ?, ?, ?)
    `
  ).run(profileId, subject, bodyHtml, bodyText, now);

  db.prepare('UPDATE business_profiles SET last_newsletter_sent_at = ? WHERE id = ?').run(now, profileId);
}

export function getLatestNewsletterForProfile(profileId) {
  return db
    .prepare('SELECT * FROM newsletters WHERE profile_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(profileId);
}
