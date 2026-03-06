export default async function handler(req, res) {
  // 1. Add CORS Headers to allow GitHub Pages to connect
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle the "preflight" browser request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Stop any non-POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
     return res.status(500).json({ error: 'API key is missing on the server' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // You can also change this to gpt-4 if you prefer
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

    // Send the successful AI reply back to your HTML
    res.status(200).json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Error communicating with AI' });
  }
}
