import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const DEFAULT_SECRET_MAPPINGS = [
  {
    envName: 'AZURE_OPENAI_API_KEY',
    secretNameEnv: 'KV_SECRET_AZURE_OPENAI_API_KEY',
    defaultSecretName: 'azure-openai-api-key'
  },
  {
    envName: 'OPENAI_API_KEY',
    secretNameEnv: 'KV_SECRET_OPENAI_API_KEY',
    defaultSecretName: 'openai-api-key'
  },
  {
    envName: 'SMTP_PASS',
    secretNameEnv: 'KV_SECRET_SMTP_PASS',
    defaultSecretName: 'smtp-pass'
  },
  {
    envName: 'SMTP_USER',
    secretNameEnv: 'KV_SECRET_SMTP_USER',
    defaultSecretName: 'smtp-user'
  }
];

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildSecretName(mapping) {
  const override = process.env[mapping.secretNameEnv];
  if (hasValue(override)) {
    return override.trim();
  }

  return mapping.defaultSecretName;
}

export async function hydrateSecretsFromKeyVault() {
  const keyVaultUri = process.env.KEY_VAULT_URI;

  if (!hasValue(keyVaultUri)) {
    return { enabled: false, loadedSecrets: [], skippedSecrets: [] };
  }

  const credential = new DefaultAzureCredential();
  const client = new SecretClient(keyVaultUri.trim(), credential);

  const loadedSecrets = [];
  const skippedSecrets = [];

  for (const mapping of DEFAULT_SECRET_MAPPINGS) {
    if (hasValue(process.env[mapping.envName])) {
      skippedSecrets.push({ envName: mapping.envName, reason: 'already_set' });
      continue;
    }

    const secretName = buildSecretName(mapping);

    try {
      const secret = await client.getSecret(secretName);

      if (hasValue(secret.value)) {
        process.env[mapping.envName] = secret.value;
        loadedSecrets.push({ envName: mapping.envName, secretName });
      } else {
        skippedSecrets.push({ envName: mapping.envName, reason: 'empty_secret_value', secretName });
      }
    } catch {
      skippedSecrets.push({ envName: mapping.envName, reason: 'not_found_or_no_access', secretName });
    }
  }

  return {
    enabled: true,
    loadedSecrets,
    skippedSecrets
  };
}
