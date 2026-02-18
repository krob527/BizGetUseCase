const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';

function trimTrailingSlash(value) {
  if (!value) {
    return value;
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function resolveAiConfig() {
  const azureEndpoint = trimTrailingSlash(process.env.AZURE_OPENAI_ENDPOINT);
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
  const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-10-21';

  if (azureEndpoint || azureApiKey || azureDeployment) {
    if (!azureEndpoint || !azureApiKey || !azureDeployment) {
      throw new Error(
        'Azure OpenAI config is incomplete. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT in .env.'
      );
    }

    return {
      provider: 'azure-openai',
      url: `${azureEndpoint}/openai/deployments/${encodeURIComponent(azureDeployment)}/chat/completions?api-version=${encodeURIComponent(azureApiVersion)}`,
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey
      },
      bodyBase: {
        temperature: 0.5
      }
    };
  }

  const openAiApiKey = process.env.OPENAI_API_KEY;
  const openAiModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  if (!openAiApiKey) {
    throw new Error(
      'No AI provider configured. For Azure OpenAI set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT. Or set OPENAI_API_KEY for OpenAI.'
    );
  }

  return {
    provider: 'openai',
    url: OPENAI_CHAT_COMPLETIONS_URL,
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      'Content-Type': 'application/json'
    },
    bodyBase: {
      model: openAiModel,
      temperature: 0.5
    }
  };
}

function parseModelResponse(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');

    if (start >= 0 && end > start) {
      return JSON.parse(rawText.slice(start, end + 1));
    }

    throw new Error('Unable to parse AI response as JSON');
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function generateNewsletter(profile) {
  const aiConfig = resolveAiConfig();

  const prompt = `
You are an AI strategy consultant for small and medium businesses.

Given this profile:
- Owner Name: ${profile.owner_name}
- Business Name: ${profile.business_name}
- Purpose: ${profile.purpose}
- Team Size: ${profile.team_size}
- Locations: ${profile.locations_json}
- Long-Term Goal: ${profile.long_term_goal}
- Short-Term Goals:
  1) ${profile.short_term_goal_1}
  2) ${profile.short_term_goal_2}
  3) ${profile.short_term_goal_3}

Return ONLY valid JSON matching this shape:
{
  "newsletterSubject": "string",
  "intro": "string",
  "useCases": [
    {
      "title": "string",
      "whyItFits": "string",
      "firstStepThisWeek": "string",
      "expectedBusinessImpact": "string"
    }
  ],
  "weeklyActionPlan": ["string", "string", "string"],
  "closing": "string"
}

Rules:
- exactly 3 useCases.
- each use case must map directly to at least one stated goal.
- keep language practical and non-technical for a business owner.
- no markdown, no extra keys, no preamble.
`;

  const response = await fetch(aiConfig.url, {
    method: 'POST',
    headers: aiConfig.headers,
    body: JSON.stringify({
      ...aiConfig.bodyBase,
      messages: [
        {
          role: 'system',
          content:
            'You produce highly accurate and concise JSON for business owners. Never include markdown or extra text.'
        },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed (${response.status}): ${err}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error('AI response was empty.');
  }

  const parsed = parseModelResponse(rawText);

  if (!Array.isArray(parsed.useCases) || parsed.useCases.length !== 3) {
    throw new Error('AI response did not include exactly 3 use cases.');
  }

  const intro = escapeHtml(parsed.intro || '');
  const closing = escapeHtml(parsed.closing || '');
  const subject = String(parsed.newsletterSubject || `Weekly AI Ideas for ${profile.business_name}`).trim();

  const useCasesHtml = parsed.useCases
    .map((item, index) => {
      const title = escapeHtml(item.title || `Use Case ${index + 1}`);
      const why = escapeHtml(item.whyItFits || '');
      const step = escapeHtml(item.firstStepThisWeek || '');
      const impact = escapeHtml(item.expectedBusinessImpact || '');

      return `
        <li style="margin-bottom:16px;">
          <h3 style="margin:0 0 6px 0;">${index + 1}. ${title}</h3>
          <p style="margin:0 0 4px 0;"><strong>Why it fits:</strong> ${why}</p>
          <p style="margin:0 0 4px 0;"><strong>First step this week:</strong> ${step}</p>
          <p style="margin:0;"><strong>Expected impact:</strong> ${impact}</p>
        </li>
      `;
    })
    .join('');

  const actionItems = Array.isArray(parsed.weeklyActionPlan) ? parsed.weeklyActionPlan.slice(0, 3) : [];

  const actionHtml = actionItems
    .map((item) => `<li style="margin-bottom:6px;">${escapeHtml(String(item))}</li>`)
    .join('');

  const bodyHtml = `
    <div style="font-family:Segoe UI, Arial, sans-serif; color:#111827; line-height:1.5;">
      <p>Hello ${escapeHtml(profile.owner_name)},</p>
      <p>${intro}</p>
      <h2 style="margin-top:24px;">3 AI Use Cases for ${escapeHtml(profile.business_name)}</h2>
      <ol style="padding-left:20px;">${useCasesHtml}</ol>
      <h2 style="margin-top:24px;">Your Weekly Action Plan</h2>
      <ol style="padding-left:20px;">${actionHtml}</ol>
      <p style="margin-top:20px;">${closing}</p>
      <p>— BizGet AI Weekly</p>
    </div>
  `;

  const useCasesText = parsed.useCases
    .map((item, index) => {
      return `${index + 1}) ${item.title}\nWhy it fits: ${item.whyItFits}\nFirst step this week: ${item.firstStepThisWeek}\nExpected impact: ${item.expectedBusinessImpact}`;
    })
    .join('\n\n');

  const actionText = actionItems.map((item, index) => `${index + 1}. ${item}`).join('\n');

  const bodyText = `
Hello ${profile.owner_name},

${parsed.intro}

3 AI Use Cases for ${profile.business_name}
${useCasesText}

Your Weekly Action Plan
${actionText}

${parsed.closing}

— BizGet AI Weekly
  `.trim();

  return {
    subject,
    bodyHtml,
    bodyText
  };
}
