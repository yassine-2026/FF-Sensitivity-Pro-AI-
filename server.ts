import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { deviceType, deviceName, ram } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `Act as an expert mobile gaming performance analyst for the game Free Fire.
A user has the following device:
Device Type: ${deviceType}
Device Name: ${deviceName}
RAM: ${ram}GB

Analyze this device's CPU power, GPU power, screen refresh rate, touch response, and gaming performance.
Then, generate the optimal Free Fire sensitivity settings and recommendations in JSON format exactly as follows:

{
  "analysis": {
    "cpu": "Brief CPU analysis",
    "gpu": "Brief GPU analysis",
    "performance": "Overall gaming performance rating out of 10"
  },
  "sensitivity": {
    "general": 0-100,
    "redDot": 0-100,
    "scope2x": 0-100,
    "scope4x": 0-100,
    "sniperScope": 0-100,
    "freeLook": 0-100
  },
  "recommendations": {
    "dpi": "Recommended DPI (e.g., 400, 600, 800, or Default)",
    "fireButtonSize": "e.g., 45% - 55%",
    "graphics": "e.g., Smooth, Standard, Ultra",
    "fps": "e.g., Normal, High",
    "tips": ["Tip 1", "Tip 2"]
  }
}

Respond ONLY with valid JSON. Do not include any markdown formatting like \`\`\`json.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-70b-8192',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from Groq');
    }
    
    const result = JSON.parse(responseContent);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing device:', error);
    res.status(500).json({ error: 'Failed to analyze device. Please try again later.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
