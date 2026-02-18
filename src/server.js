import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateNewsletter } from './ai.js';
import {
  getAllProfiles,
  getLatestNewsletterForProfile,
  upsertBusinessProfile,
  saveNewsletter
} from './db.js';
import { sendNewsletterEmail } from './mailer.js';
import { hydrateSecretsFromKeyVault } from './keyvault.js';
import { runWeeklyNewsletterJob, startWeeklyNewsletterJob } from './scheduler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
let startupSecretStatus = {
  enabled: false,
  loadedSecrets: [],
  skippedSecrets: []
};

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getConfigHealth() {
  const hasAzureEndpoint = hasValue(process.env.AZURE_OPENAI_ENDPOINT);
  const hasAzureApiKey = hasValue(process.env.AZURE_OPENAI_API_KEY);
  const hasAzureDeployment = hasValue(process.env.AZURE_OPENAI_DEPLOYMENT);
  const hasOpenAiKey = hasValue(process.env.OPENAI_API_KEY);

  let aiProvider = 'none';
  const missingVars = [];

  if (hasAzureEndpoint || hasAzureApiKey || hasAzureDeployment) {
    aiProvider = 'azure-openai';

    if (!hasAzureEndpoint) {
      missingVars.push('AZURE_OPENAI_ENDPOINT');
    }

    if (!hasAzureApiKey) {
      missingVars.push('AZURE_OPENAI_API_KEY');
    }

    if (!hasAzureDeployment) {
      missingVars.push('AZURE_OPENAI_DEPLOYMENT');
    }
  } else if (hasOpenAiKey) {
    aiProvider = 'openai';
  } else {
    missingVars.push('AZURE_OPENAI_ENDPOINT');
    missingVars.push('AZURE_OPENAI_API_KEY');
    missingVars.push('AZURE_OPENAI_DEPLOYMENT');
    missingVars.push('OPENAI_API_KEY');
  }

  const smtpRequired = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM'];

  for (const varName of smtpRequired) {
    if (!hasValue(process.env[varName])) {
      missingVars.push(varName);
    }
  }

  return {
    ready: missingVars.length === 0,
    aiProvider,
    keyVaultEnabled: hasValue(process.env.KEY_VAULT_URI),
    missingVars
  };
}

function validatePayload(payload) {
  const requiredStringFields = ['ownerName', 'businessName', 'email', 'purpose', 'longTermGoal'];

  for (const field of requiredStringFields) {
    if (!payload[field] || typeof payload[field] !== 'string' || !payload[field].trim()) {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  if (!Number.isInteger(Number(payload.teamSize)) || Number(payload.teamSize) < 1) {
    throw new Error('teamSize must be a positive integer');
  }

  if (!Array.isArray(payload.locations) || payload.locations.length < 1) {
    throw new Error('locations must contain at least one location');
  }

  for (const location of payload.locations) {
    if (typeof location !== 'string' || !location.trim()) {
      throw new Error('Each location must be a non-empty string');
    }
  }

  if (!Array.isArray(payload.shortTermGoals) || payload.shortTermGoals.length !== 3) {
    throw new Error('shortTermGoals must contain exactly 3 goals');
  }

  for (const goal of payload.shortTermGoals) {
    if (typeof goal !== 'string' || !goal.trim()) {
      throw new Error('Each short term goal must be a non-empty string');
    }
  }
}

app.post('/api/profile', async (req, res) => {
  try {
    validatePayload(req.body);

    const profile = upsertBusinessProfile(req.body);

    const newsletter = await generateNewsletter(profile);

    await sendNewsletterEmail({
      to: profile.email,
      subject: newsletter.subject,
      bodyHtml: newsletter.bodyHtml,
      bodyText: newsletter.bodyText
    });

    saveNewsletter(profile.id, newsletter.subject, newsletter.bodyHtml, newsletter.bodyText);

    return res.status(201).json({
      success: true,
      message: 'Profile saved. Your first personalized newsletter was emailed successfully.'
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process profile.'
    });
  }
});

app.get('/api/profiles', (req, res) => {
  const profiles = getAllProfiles().map((profile) => {
    const latest = getLatestNewsletterForProfile(profile.id);
    return {
      id: profile.id,
      ownerName: profile.owner_name,
      businessName: profile.business_name,
      email: profile.email,
      teamSize: profile.team_size,
      locations: JSON.parse(profile.locations_json),
      lastNewsletterSentAt: profile.last_newsletter_sent_at,
      latestSubject: latest?.subject || null
    };
  });

  res.json({ success: true, profiles });
});

app.post('/api/newsletters/run-now', async (req, res) => {
  try {
    await runWeeklyNewsletterJob();
    return res.json({ success: true, message: 'Weekly newsletter job executed.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to run newsletter job.' });
  }
});

app.get('/api/health/config', (req, res) => {
  const health = getConfigHealth();

  const payload = {
    success: health.ready,
    ready: health.ready,
    aiProvider: health.aiProvider,
    keyVault: {
      enabled: startupSecretStatus.enabled,
      loadedSecretCount: startupSecretStatus.loadedSecrets.length,
      skippedSecretCount: startupSecretStatus.skippedSecrets.length
    },
    missingVars: health.missingVars
  };

  if (health.ready) {
    return res.json(payload);
  }

  return res.status(503).json(payload);
});

async function bootstrap() {
  try {
    startupSecretStatus = await hydrateSecretsFromKeyVault();

    if (startupSecretStatus.enabled) {
      console.log(`Key Vault enabled. Loaded ${startupSecretStatus.loadedSecrets.length} secrets.`);
    }

    const configuredCron = startWeeklyNewsletterJob();

    app.listen(port, () => {
      console.log(`BizGetUseCase server listening on http://localhost:${port}`);
      console.log(`Weekly newsletter cron configured: ${configuredCron}`);
    });
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}

bootstrap();
