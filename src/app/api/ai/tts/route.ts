import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import https from "https";

/**
 * NUR Finance — Multi-Tier Hyper-Realistic Human Voice Engine
 *
 * Tier 1: ElevenLabs Multilingual v2 (If ELEVENLABS_API_KEY is configured in .env.local)
 * Tier 2: Microsoft Edge Studio Neural HD (Direct 24kHz/48kbps Neural Voices — EmelNeural, AriaNeural, ChristopherNeural, etc.)
 * Tier 3: High-Speed Web Audio Fallback
 */

export interface VoiceProfile {
  voice: string;
  name: string;
  defaultRate: string;
  gender: "female" | "male";
}

const NEURAL_VOICE_MAP: Record<string, VoiceProfile> = {
  tr: { voice: "tr-TR-EmelNeural", name: "Umay Nur (TR Studio Female)", defaultRate: "+22%", gender: "female" },
  tr_male: { voice: "tr-TR-AhmetNeural", name: "Umay Gün / Demir (TR Studio Male)", defaultRate: "+20%", gender: "male" },
  en: { voice: "en-US-AriaNeural", name: "Elena Vance (US Broadcast Female)", defaultRate: "+20%", gender: "female" },
  en_male: { voice: "en-US-ChristopherNeural", name: "Marcus Sterling (US Anchor Male)", defaultRate: "+18%", gender: "male" },
  "en-gb": { voice: "en-GB-SoniaNeural", name: "Victoria Ashworth (London Female)", defaultRate: "+18%", gender: "female" },
  de: { voice: "de-DE-KatjaNeural", name: "Katharina Vogt (Frankfurt Female)", defaultRate: "+18%", gender: "female" },
  fr: { voice: "fr-FR-DeniseNeural", name: "Camille Dubois (Paris Female)", defaultRate: "+18%", gender: "female" },
  ru: { voice: "ru-RU-SvetlanaNeural", name: "Viktoria Smirnova (Moscow Female)", defaultRate: "+18%", gender: "female" },
  ar: { voice: "ar-SA-ZariyahNeural", name: "Fatima Al-Qahtani (Dubai Female)", defaultRate: "+15%", gender: "female" },
  ar_male: { voice: "ar-AE-HamdanNeural", name: "Zaid Al-Mansoor (Dubai Male)", defaultRate: "+15%", gender: "male" },
};

/**
 * Calls ElevenLabs API if key is present in .env.local
 */
async function generateElevenLabsTTS(text: string, apiKey: string, voiceId?: string): Promise<Buffer | null> {
  const targetVoice = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default Rachel / Broadcaster
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}?optimize_streaming_latency=3`;

  return new Promise((resolve) => {
    const payload = JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.50,
        similarity_boost: 0.85,
        style: 0.40,
        use_speaker_boost: true,
      },
    });

    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(Buffer.from(c)));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on("error", () => resolve(null));
    req.write(payload);
    req.end();
  });
}

/**
 * Calls Microsoft Edge Neural HD engine (EmelNeural, AriaNeural, etc.)
 */
async function synthesizeEdgeNeuralHD(text: string, voiceName: string, rate = "+22%"): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  return new Promise((resolve, reject) => {
    const { audioStream } = tts.toStream(text, {
      rate: rate,
      pitch: "+0Hz",
    });

    const chunks: Buffer[] = [];
    audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
    audioStream.on("end", () => resolve(Buffer.concat(chunks)));
    audioStream.on("error", (err: Error) => reject(err));
  });
}

function resolveVoiceKey(langCode: string, isMale = false): string {
  const lc = langCode.toLowerCase();
  if (lc.startsWith("tr")) return isMale ? "tr_male" : "tr";
  if (lc === "en-gb" || lc.startsWith("en-gb")) return "en-gb";
  if (lc.startsWith("en")) return isMale ? "en_male" : "en";
  if (lc.startsWith("de")) return "de";
  if (lc.startsWith("fr")) return "fr";
  if (lc.startsWith("ru")) return "ru";
  if (lc.startsWith("ar")) return isMale ? "ar_male" : "ar";
  return "tr";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text || "";
    const langCode = (body.languageCode || body.langCode || "tr-TR").toLowerCase();
    const isMale = !!body.isMale || (body.anchorName && ["Marcus Sterling", "Umay Gün", "Demir", "Klaus Weber", "Laurent Mercier", "Виктор Петров", "زيد المنصور"].some(n => body.anchorName.includes(n)));
    const customRate = body.rate || (body.speed ? `+${Math.round((body.speed - 1) * 100)}%` : undefined);

    if (!text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const voiceKey = resolveVoiceKey(langCode, isMale);
    const voiceConfig = NEURAL_VOICE_MAP[voiceKey] || NEURAL_VOICE_MAP["tr"];
    const activeRate = customRate || voiceConfig.defaultRate;

    // 1. ElevenLabs priority if user has added ELEVENLABS_API_KEY to .env.local
    const elevenKey = process.env.ELEVENLABS_API_KEY || "";
    if (elevenKey) {
      const elevenAudio = await generateElevenLabsTTS(text, elevenKey, body.elevenVoiceId);
      if (elevenAudio && elevenAudio.length > 0) {
        const base64 = elevenAudio.toString("base64");
        return NextResponse.json({
          success: true,
          provider: "elevenlabs_studio_human",
          audioBase64: base64,
          audioUrl: `data:audio/mp3;base64,${base64}`,
          format: "mp3",
          voice: voiceConfig.name,
          rate: activeRate,
        });
      }
    }

    // 2. Microsoft Edge Studio Neural HD (EmelNeural / AriaNeural)
    try {
      const neuralBuffer = await synthesizeEdgeNeuralHD(text, voiceConfig.voice, activeRate);
      const base64 = neuralBuffer.toString("base64");
      return NextResponse.json({
        success: true,
        provider: "ms_edge_neural_hd",
        audioBase64: base64,
        audioUrl: `data:audio/mp3;base64,${base64}`,
        format: "mp3",
        voice: voiceConfig.name,
        voiceId: voiceConfig.voice,
        rate: activeRate,
      });
    } catch (edgeErr) {
      console.error("[Edge TTS Error]:", edgeErr);
      return NextResponse.json({ error: "Neural synthesis error", details: (edgeErr as Error).message }, { status: 502 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "Nur Finans canli yayinimiz basliyor.";
  const lang = searchParams.get("lang") || "tr";
  const male = searchParams.get("male") === "true";
  const rateParam = searchParams.get("rate");

  const voiceKey = resolveVoiceKey(lang, male);
  const voiceConfig = NEURAL_VOICE_MAP[voiceKey] || NEURAL_VOICE_MAP["tr"];
  const activeRate = rateParam || voiceConfig.defaultRate;

  try {
    // 1. ElevenLabs if present
    const elevenKey = process.env.ELEVENLABS_API_KEY || "";
    if (elevenKey) {
      const elevenAudio = await generateElevenLabsTTS(text, elevenKey);
      if (elevenAudio && elevenAudio.length > 0) {
        return new NextResponse(new Uint8Array(elevenAudio), {
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": elevenAudio.length.toString(),
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }

    // 2. Microsoft Edge Studio Neural HD
    const audioBuf = await synthesizeEdgeNeuralHD(text, voiceConfig.voice, activeRate);
    return new NextResponse(new Uint8Array(audioBuf), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuf.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

