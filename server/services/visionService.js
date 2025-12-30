const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL =
  process.env.OPENROUTER_VISION_MODEL || 'openai/gpt-4o-mini';

/**
 * Analyze image using OpenRouter (OpenAI-compatible) chat completions API
 * to detect labels and generate tags.
 *
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<{labels: Array, tags: Array}>}
 */
async function analyzeImage(imageBuffer, mimeType) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
    console.warn('OpenRouter API key not set, returning empty labels');
    return { labels: [], tags: [] };
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
                    "Analyze this image and provide a JSON array of objects. Each object should have 'label' (the detected object/concept) and 'confidence' (a number between 0 and 1). " +
                    'Focus on the main subjects, objects, and concepts visible in the image. Return only valid JSON, no other text. ' +
                    'Example format: [{"label": "Dog", "confidence": 0.95}, {"label": "Outdoor", "confidence": 0.87}]',
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
          max_tokens: 500,
          temperature: 0.2,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter label API error:', response.status, errorText);
      return { labels: [], tags: [] };
    }

    const data = await response.json();
    const content =
      (data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : '') || '';
    const trimmed = content.trim();

    let labels = [];
    try {
      let cleaned = trimmed;
      if (cleaned.startsWith('```')) {
        cleaned = cleaned
          .replace(/```json\s*/i, '')
          .replace(/```/g, '')
          .trim();
      }
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) {
        labels = JSON.parse(match[0]);
      } else {
        labels = JSON.parse(cleaned);
      }

      if (!Array.isArray(labels)) {
        console.warn('OpenRouter label response is not an array');
        labels = [];
      }
    } catch (parseErr) {
      console.error('Failed to parse OpenRouter label JSON:', parseErr);
      console.log('Raw content:', trimmed);
      return { labels: [], tags: [] };
    }

    const filteredLabels = labels
      .filter(
        (l) =>
          l &&
          typeof l.confidence === 'number' &&
          l.confidence >= 0.7 &&
          typeof l.label === 'string'
      )
      .map((l) => ({ description: l.label, score: l.confidence }));

    const tags = filteredLabels.map((l) => l.description);

    return { labels: filteredLabels, tags };
  } catch (err) {
    console.error('Error calling OpenRouter for labels:', err);
    return { labels: [], tags: [] };
  }
}

module.exports = { analyzeImage };
