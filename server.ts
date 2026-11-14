import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

// In-memory LRU cache for generated WAV audio clips so repeated narration plays instantly
const MAX_CACHE_ENTRIES = 90;
const ttsCache = new Map<string, string>();

function getCachedAudio(key: string): string | undefined {
  const existing = ttsCache.get(key);
  if (existing) {
    // Refresh recency
    ttsCache.delete(key);
    ttsCache.set(key, existing);
  }
  return existing;
}

function setCachedAudio(key: string, base64Wav: string): void {
  if (ttsCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = ttsCache.keys().next().value;
    if (oldestKey) {
      ttsCache.delete(oldestKey);
    }
  }
  ttsCache.set(key, base64Wav);
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ALLOWED_VOICES = new Set(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']);

async function synthesizeExpressiveSpeech(
  ai: GoogleGenAI,
  text: string,
  voiceName: string,
  style: string,
  useFlagship: boolean,
  includeSpeechMetadata = true
): Promise<string | null> {
  const model = useFlagship ? 'gemini-3.8-flash-tts' : 'gemini-3.8-flash-lite-tts';
  const safeVoice = ALLOWED_VOICES.has(voiceName) ? voiceName : 'Zephyr';

  const partPayload = includeSpeechMetadata
    ? { text, speechMetadata: { style } }
    : { text: `Speak in this style (${style}): ${text}` };

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [partPayload],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: safeVoice,
          },
        },
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    return null;
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return part.inlineData.data;
    }
  }
  return null;
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );
    res.json({ ok: true, geminiTtsAvailable: hasKey });
  });

  app.post('/api/tts', async (req, res) => {
    try {
      const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
      const voiceName = typeof req.body?.voiceName === 'string' ? req.body.voiceName : 'Zephyr';
      const persona = typeof req.body?.persona === 'string' ? req.body.persona : 'narrator';
      const customStyle = typeof req.body?.style === 'string' ? req.body.style.trim() : '';

      if (!rawText) {
        res.status(400).json({ error: 'Text is required for speech synthesis.' });
        return;
      }

      const clippedText = rawText.slice(0, 1800);

      let defaultStyle =
        'Warm, expressive, natural human storyteller speaking to curious kids and space fans, gentle wonder, natural breathing and conversational phrasing, never robotic';
      let useFlagship = true;

      if (persona === 'toon') {
        defaultStyle =
          'Cheerful, lively, friendly cartoon space companion talking excitedly to a young explorer, warm human inflection, playful wonder, natural pauses, bright and never robotic';
        useFlagship = true;
      } else if (persona === 'machine') {
        defaultStyle =
          'Warm, poetic, heartfelt human voice bringing a brave space explorer to life with gentle emotion, pride, and wonder — expressive and deeply human, never stiff or mechanical';
        useFlagship = true;
      } else if (persona === 'chapter') {
        defaultStyle =
          'Engaging, clear, warmly animated science storyteller reading to school-age explorers, vivid curiosity, smooth natural rhythm, never monotone';
        useFlagship = false;
      }

      const stylePrompt = customStyle || defaultStyle;
      const cacheKey = crypto
        .createHash('sha256')
        .update(`${persona}:${voiceName}:${stylePrompt}:${clippedText}`)
        .digest('hex');

      const cached = getCachedAudio(cacheKey);
      if (cached) {
        res.json({ audioBase64: cached, mimeType: 'audio/wav', cached: true });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.json({ fallback: true, reason: 'No server TTS key configured' });
        return;
      }

      const aiAlpha = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        apiVersion: 'v1alpha',
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      let audioBase64: string | null = null;
      let lastErrorMsg = '';

      const attempts: Array<() => Promise<string | null>> = [
        () => synthesizeExpressiveSpeech(aiAlpha, clippedText, voiceName, stylePrompt, useFlagship, true),
        () => synthesizeExpressiveSpeech(aiAlpha, clippedText, voiceName, stylePrompt, false, true),
        () => synthesizeExpressiveSpeech(ai, clippedText, voiceName, stylePrompt, false, false),
      ];

      for (const attempt of attempts) {
        try {
          audioBase64 = await attempt();
          if (audioBase64) break;
        } catch (err) {
          lastErrorMsg = err instanceof Error ? err.message : String(err);
        }
      }

      if (!audioBase64) {
        res.json({ fallback: true, reason: 'TTS temporarily unavailable', detail: lastErrorMsg });
        return;
      }

      setCachedAudio(cacheKey, audioBase64);
      res.json({ audioBase64, mimeType: 'audio/wav', cached: false });
    } catch (error) {
      console.error('Error in /api/tts:', error);
      res.json({ fallback: true, reason: 'Unexpected TTS error' });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Silent Machines server running on http://0.0.0.0:${PORT}`);
  });
}

createServer();
