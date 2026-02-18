# BizGetUseCase

An MVP app for business owners to:
- submit a business profile,
- receive 3 AI use cases tailored to their goals,
- get a personalized newsletter email every week.

## Features

- Business profile form captures:
  - business purpose
  - team size
  - number of locations and location details
  - 1 primary long-term goal
  - 3 short-term goals
- AI-generated newsletter with exactly 3 mapped use cases
- Automatic weekly email send (cron)
- Manual "run now" trigger for the weekly job
- SQLite persistence for profiles and newsletter history

## Tech Stack

- Node.js + Express
- SQLite (`better-sqlite3`)
- Azure OpenAI or OpenAI Chat Completions API
- Nodemailer for email
- `node-cron` for weekly scheduling

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
copy .env.example .env
```

3. Fill in `.env` values:
  - If using Azure OpenAI: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT`, optional `AZURE_OPENAI_API_VERSION`
  - Or if using OpenAI: `OPENAI_API_KEY` and optional `OPENAI_MODEL`
  - Also fill SMTP settings for email.

### Azure Key Vault (optional, recommended)

You can store sensitive values in Azure Key Vault and let the app load them at startup.

1. Set `KEY_VAULT_URI` in `.env`.
2. Ensure your runtime identity has Key Vault secret read permissions.
  - Local dev: sign in with `az login`.
  - Azure hosting: use managed identity + Key Vault RBAC (`Key Vault Secrets User`).
3. Create secrets in Key Vault (default names):
  - `azure-openai-api-key`
  - `openai-api-key`
  - `smtp-user`
  - `smtp-pass`
4. Optional: override any secret name with env vars:
  - `KV_SECRET_AZURE_OPENAI_API_KEY`
  - `KV_SECRET_OPENAI_API_KEY`
  - `KV_SECRET_SMTP_USER`
  - `KV_SECRET_SMTP_PASS`

When a variable already exists in `.env`, that local value is kept. Missing values are fetched from Key Vault.

4. Start app:

```bash
npm run dev
```

5. Open:

- `http://localhost:3000`

## API Endpoints

- `POST /api/profile`
  - Saves/updates business profile by email
  - Immediately generates and emails first newsletter
- `GET /api/profiles`
  - Returns stored profiles + latest newsletter subject
- `POST /api/newsletters/run-now`
  - Runs weekly newsletter process immediately

## Notes

- Weekly scheduler defaults to Monday 9:00 AM local server time.
- Use `NEWSLETTER_CRON` to customize schedule.
- SQLite DB file (`data.db`) is created automatically at runtime.

## Troubleshooting

- Error: `OPENAI_API_KEY is missing` (or no provider configured)
  - For Azure OpenAI, set all required Azure values in `.env`:
    - `AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com`
    - `AZURE_OPENAI_API_KEY=<key>`
    - `AZURE_OPENAI_DEPLOYMENT=<deployment-name>`
    - `AZURE_OPENAI_API_VERSION=2024-10-21` (or your supported version)
