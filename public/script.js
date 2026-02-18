const form = document.getElementById('profile-form');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const profilesList = document.getElementById('profiles-list');
const refreshBtn = document.getElementById('refresh-btn');
const runNowBtn = document.getElementById('run-now-btn');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b91c1c' : '#065f46';
}

function parseLocations(locationsText) {
  return locationsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function getPayload() {
  const data = new FormData(form);

  return {
    ownerName: data.get('ownerName'),
    businessName: data.get('businessName'),
    email: data.get('email'),
    purpose: data.get('purpose'),
    teamSize: Number(data.get('teamSize')),
    locations: parseLocations(data.get('locations') || ''),
    longTermGoal: data.get('longTermGoal'),
    shortTermGoals: [data.get('shortTermGoal1'), data.get('shortTermGoal2'), data.get('shortTermGoal3')]
  };
}

async function loadProfiles() {
  profilesList.textContent = 'Loading profiles...';

  try {
    const response = await fetch('/api/profiles');
    const payload = await response.json();

    if (!payload.success) {
      throw new Error(payload.message || 'Unable to load profiles');
    }

    if (!payload.profiles.length) {
      profilesList.textContent = 'No profiles yet.';
      return;
    }

    profilesList.innerHTML = payload.profiles
      .map((profile) => {
        const locations = profile.locations.join(', ');
        const lastSent = profile.lastNewsletterSentAt
          ? new Date(profile.lastNewsletterSentAt).toLocaleString()
          : 'Not sent yet';

        return `
          <article class="profile-row">
            <strong>${profile.businessName}</strong> (${profile.email})<br />
            Owner: ${profile.ownerName}<br />
            Team size: ${profile.teamSize}<br />
            Locations: ${locations}<br />
            Last newsletter: ${lastSent}<br />
            Last subject: ${profile.latestSubject || 'N/A'}
          </article>
        `;
      })
      .join('');
  } catch (error) {
    profilesList.textContent = error.message;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  setStatus('Saving profile and generating newsletter...');

  try {
    const payload = getPayload();

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to save profile');
    }

    setStatus(data.message || 'Profile saved successfully.');
    form.reset();
    await loadProfiles();
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    submitBtn.disabled = false;
  }
});

refreshBtn.addEventListener('click', async () => {
  await loadProfiles();
});

runNowBtn.addEventListener('click', async () => {
  runNowBtn.disabled = true;
  setStatus('Running weekly newsletter job...');

  try {
    const response = await fetch('/api/newsletters/run-now', { method: 'POST' });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to run weekly job');
    }

    setStatus('Weekly newsletter job finished.');
    await loadProfiles();
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    runNowBtn.disabled = false;
  }
});

loadProfiles();
