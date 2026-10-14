import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(express.json({ limit: '35mb' }));

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/live' });

// Initialize GoogleGenAI client with required header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. Multi-turn Chat Endpoint (gemini-3.5-flash or gemini-3.1-pro-preview)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, model } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction:
          systemInstruction ||
          'You are SmartFlow AI Transit Intelligence Advisor, a public transport crowd forecasting expert. Assist passengers and transport authorities with routing insights, crowd predictions, bottleneck solutions, and commuter tips.',
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate chat response',
    });
  }
});

// 2. Google Search Grounding Endpoint (gemini-3.5-flash with googleSearch)
app.post('/api/search-grounding', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      text: response.text,
      groundingChunks: chunks,
    });
  } catch (error: any) {
    console.error('Search Grounding API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to fetch search grounded data',
    });
  }
});

// 3. Google Maps Grounding Endpoint (gemini-3.5-flash with googleMaps)
app.post('/api/maps-grounding', async (req, res) => {
  try {
    const { prompt, location } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Default to Coimbatore transit core
    const lat = location?.latitude ?? 11.0168;
    const lng = location?.longitude ?? 76.9558;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      },
    });

    const chunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      text: response.text,
      groundingChunks: chunks,
    });
  } catch (error: any) {
    console.error('Maps Grounding API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to fetch maps grounded data',
    });
  }
});

// 4. Audio Transcription Endpoint (gemini-3.5-transcribe)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { base64Audio, mimeType } = req.body;
    if (!base64Audio) {
      return res.status(400).json({ error: 'base64Audio is required.' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: base64Audio,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this public transit commuter speech or query verbatim accurately in plain text.',
          },
        ],
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Transcribe API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to transcribe audio',
    });
  }
});

// 5. Generate Music (lyria-3-clip-preview)
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt } = req.body;
    const musicPrompt =
      prompt ||
      'Generate a 30-second relaxing ambient commute lo-fi acoustic track for calming passengers during crowded peak-hour public bus rides.';

    const responseStream = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: musicPrompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    res.json({ audioBase64, lyrics, mimeType });
  } catch (error: any) {
    console.error('Music Generation API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate music clip',
    });
  }
});

// 6. WebSocket Server for Live Voice Conversation (gemini-3.8-live)
wss.on('connection', async (clientWs: WebSocket) => {
  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction:
          'You are SmartFlow Real-Time Voice Co-Pilot. You speak with public transit commuters and transport dispatchers in a concise, friendly, and knowledgeable tone. You give immediate answers about route crowding, departure times, congestion avoidance, and bus recommendations.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          try {
            const audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (
              message.serverContent?.interrupted &&
              clientWs.readyState === WebSocket.OPEN
            ) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          } catch (err) {
            console.error('Error forwarding Live audio chunk:', err);
          }
        },
      },
    });

    clientWs.send(
      JSON.stringify({ status: 'connected', model: 'gemini-3.8-live' })
    );

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Error sending audio to Gemini Live:', err);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try {
          session.close();
        } catch (e) {
          // ignore
        }
      }
    });
  } catch (error: any) {
    console.error('Gemini Live session connection error:', error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          error:
            error?.message ||
            'Failed to establish Gemini Live connection. Check API key settings.',
        })
      );
    }
  }
});

// Mount Vite or serve static assets
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`SmartFlow Server running on http://0.0.0.0:${PORT}`);
});
