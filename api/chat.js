export default async function handler(req, res) {
  // 1. FORCED CORS HEADERS FOR EVERY REQUEST
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows your GitHub Pages to connect
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // 2. HANDLE THE "PREFLIGHT" BROWSER CHECK
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. REJECT NON-POST REQUESTS
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 4. GET THE SECRET KEY
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
     return res.status(500).json({ error: 'API key is missing on the server' });
  }

  // 5. TALK TO OPENAI
  try {
    const { message } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for Wexford Edu Hub, a premium learning platform." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    res.status(200).json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Error communicating with AI' });
  }
}
