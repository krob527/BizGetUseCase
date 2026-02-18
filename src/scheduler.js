import cron from 'node-cron';
import { generateNewsletter } from './ai.js';
import { getAllProfiles, saveNewsletter } from './db.js';
import { sendNewsletterEmail } from './mailer.js';

const DEFAULT_CRON = '0 9 * * 1';

export function startWeeklyNewsletterJob() {
  const cronExpression = process.env.NEWSLETTER_CRON || DEFAULT_CRON;

  cron.schedule(cronExpression, async () => {
    await runWeeklyNewsletterJob();
  });

  return cronExpression;
}

export async function runWeeklyNewsletterJob() {
  const profiles = getAllProfiles();

  for (const profile of profiles) {
    try {
      const newsletter = await generateNewsletter(profile);

      await sendNewsletterEmail({
        to: profile.email,
        subject: newsletter.subject,
        bodyHtml: newsletter.bodyHtml,
        bodyText: newsletter.bodyText
      });

      saveNewsletter(profile.id, newsletter.subject, newsletter.bodyHtml, newsletter.bodyText);

      console.log(`Newsletter sent to ${profile.email}`);
    } catch (error) {
      console.error(`Failed to send newsletter to ${profile.email}:`, error.message);
    }
  }
}
