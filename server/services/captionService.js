const fetch = require('node-fetch');

async function generateCaption(imageBuffer, mimeType) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const OPENROUTER_MODEL = process.env.OPENROUTER_VISION_MODEL || 'openai/gpt-4o-mini';

  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not set, returning empty caption');
    return '';
  }

  try {
    const base64Image = imageBuffer.toString('base64');

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Describe this image in one short sentence.' },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || '';
  } catch (err) {
    console.error('Error calling OpenRouter for caption:', err);
    return '';
  }
}

module.exports = { generateCaption };
