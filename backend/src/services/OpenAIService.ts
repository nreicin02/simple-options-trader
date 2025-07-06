// Use the global fetch API available in Node.js 18+

const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function getOpenAIChatCompletion(messages: { role: 'user' | 'assistant' | 'system', content: string }[]) {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not set');

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = (await response.json()) as any;
  return data.choices[0].message.content;
} 