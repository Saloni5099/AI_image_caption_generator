const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL =
  process.env.OPENROUTER_VISION_MODEL || 'openai/gpt-4o-mini';

/**
 * Generate a caption for an image using an OpenRouter vision-capable model
 * @param {Buffer} imageBuffer
 * @param {string} mimeType
 * @returns {Promise<string>}
 */
async function generateCaption(imageBuffer, mimeType) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
    console.warn('OpenRouter API key not set, returning empty caption');
    return '';
  }

  try {
    const base64Image = imageBuffer.toString('base64');

    const response = await fetch(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer':
            process.env.OPENROUTER_REFERRER || 'http://localhost:5000',
          'X-Title':
            process.env.OPENROUTER_APP_NAME || 'Image Management System',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text:
                    'Describe this image in one short, simple sentence. Be concise and descriptive.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter caption API error:', response.status, errorText);
      return '';
    }

    const data = await response.json();
    const caption =
      (data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : '') || '';
    return caption.trim();
  } catch (err) {
    console.error('Error calling OpenRouter for caption:', err);
    return '';
  }
}

module.exports = { generateCaption };
