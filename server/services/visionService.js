const fetch = require('node-fetch');

async function analyzeImage(imageBuffer, mimeType) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const OPENROUTER_MODEL = process.env.OPENROUTER_VISION_MODEL || 'openai/gpt-4o-mini';

  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not set, returning empty labels');
    return { labels: [], tags: [] };
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
              { type: 'text', text: 'List 5 tags for this image.' },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';

    const tags = text.split(',').map(t => t.trim()).filter(Boolean);
    return { labels: tags.map(t => ({ description: t, score: 1 })), tags };

  } catch (err) {
    console.error('Error calling OpenRouter for labels:', err);
    return { labels: [], tags: [] };
  }
}

module.exports = { analyzeImage };
