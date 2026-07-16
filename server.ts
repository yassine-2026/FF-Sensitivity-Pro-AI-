import express from 'express';
import path from 'path';
import fs from 'fs';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Load Device Database in memory
let deviceDb: any[] = [];
try {
  const dbPath = path.resolve(process.cwd(), 'src/data/devices.json');
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    deviceDb = JSON.parse(data);
    console.log(`Loaded ${deviceDb.length} devices into memory.`);
  }
} catch (err) {
  console.error('Failed to load device database:', err);
}

// Search Devices Endpoint
app.get('/api/devices/search', (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    const lowerQuery = query.toLowerCase();
    
    // Multi-language alias and name matching
    const results = deviceDb.filter(device => {
      const matchBrandModel = device.brand.toLowerCase().includes(lowerQuery) || device.model.toLowerCase().includes(lowerQuery) || `${device.brand} ${device.model}`.toLowerCase().includes(lowerQuery);
      const matchAlias = device.aliases?.some((alias: string) => alias.toLowerCase().includes(lowerQuery));
      const matchLangName = Object.values(device.languages_names || {}).some((name: any) => name.toLowerCase().includes(lowerQuery));
      return matchBrandModel || matchAlias || matchLangName;
    }).slice(0, 10); // Return top 10 matches for fast lookup
    
    res.json(results);
  } catch (err) {
    console.error('Device search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { deviceType, deviceName, ram, deviceSpec } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
    }

    const groq = new Groq({ 
      apiKey: process.env.GROQ_API_KEY,
      maxRetries: 2,
      timeout: 30000 // 30 seconds
    });
    
    let deviceSpecsContext = '';
    if (deviceSpec) {
      deviceSpecsContext = `
The system has identified exact hardware specifications for this device from our database:
- CPU: ${deviceSpec.cpu} (${deviceSpec.cpu_cores} cores, ${deviceSpec.cpu_frequency})
- GPU: ${deviceSpec.gpu}
- Display: ${deviceSpec.display_size}, ${deviceSpec.resolution}
- Refresh Rate: ${deviceSpec.refresh_rate}Hz
- Touch Sampling Rate: ${deviceSpec.touch_sampling_rate}Hz
- Gaming Score: ${deviceSpec.gaming_score}/100
- Performance Score: ${deviceSpec.performance_score}/100

Base your sensitivity and performance recommendations primarily on these verified specs.`;
    }

    const prompt = `Act as an expert mobile gaming performance analyst for the game Free Fire.
A user has the following device:
Device Type: ${deviceType}
Device Name: ${deviceName}
RAM: ${ram}GB
${deviceSpecsContext}

If exact hardware specifications are not provided above, use your knowledge of this device model (normalize the name if necessary) to estimate its specifications (CPU, GPU, Refresh Rate, Touch Sampling Rate).

Analyze this device's performance based on its specs and categorize it as Low-end, Mid-range, High-end, or Gaming phone.
Then, generate the optimal Free Fire sensitivity settings (note: the new Free Fire sensitivity range is 0 to 200) and recommendations in JSON format exactly as follows. NEVER claim guaranteed headshots.

{
  "analysis": {
    "cpu": "Brief CPU analysis",
    "gpu": "Brief GPU analysis",
    "performance": "Overall gaming performance rating out of 10",
    "category": "Low-end / Mid-range / High-end / Gaming phone"
  },
  "sensitivity": {
    "general": 0-200,
    "redDot": 0-200,
    "scope2x": 0-200,
    "scope4x": 0-200,
    "sniperScope": 0-200,
    "freeLook": 0-200
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
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from Groq');
    }
    
    try {
      const result = JSON.parse(responseContent);
      res.json(result);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', responseContent);
      res.status(502).json({ error: 'Received invalid JSON from AI provider. Please try again.' });
    }
  } catch (error: any) {
    console.error('Error analyzing device:', error);
    if (error?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment and try again.' });
    }
    if (error?.name === 'APITimeoutError') {
      return res.status(504).json({ error: 'Request to AI provider timed out. Please try again.' });
    }
    if (error?.status === 401) {
      return res.status(401).json({ error: 'Invalid API Key provided for AI provider.' });
    }
    const errorMessage = error?.message || 'Failed to analyze device. Please try again later.';
    res.status(500).json({ error: errorMessage });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
