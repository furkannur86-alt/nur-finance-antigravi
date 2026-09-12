/**
 * NUR Finance — Text-to-Speech API with Viseme/Phoneme Data
 *
 * POST /api/ai/tts
 *
 * Body:
 *   {
 *     text: string              — plaintext or SSML
 *     voiceId?: string          — Google Cloud voice name (default: "en-US-Journey-F")
 *     languageCode?: string     — BCP-47 (default: "en-US")
 *     speakingRate?: number     — 0.25–4.0 (default: 1.0)
 *     pitch?: number            — -20.0–20.0 semitones (default: 0.0)
 *     persona?: PersonaId       — maps to a preset voice + eye color metadata
 *     format?: "mp3" | "wav"    — default "mp3"
 *     includeVisemes?: boolean  — return phoneme timestamps for lip-sync (default: false)
 *   }
 *
 * Response:
 *   {
 *     audioBase64: string       — base64-encoded audio
 *     format: "mp3" | "wav"
 *     durationMs: number        — estimated duration
 *     visemes?: Viseme[]        — if includeVisemes=true
 *     persona?: PersonaMeta     — physical descriptor for avatar rendering
 *   }
 *
 * Persona eye/wardrobe standards (CLAUDE_MEDIA_PRODUCTION_MASTER_PLAN.md):
 *   Female anchors: Luminous Emerald Green eyes — always.
 *   Male anchors:   Emerald Green OR Steel/Ocean Blue eyes.
 */

import { NextRequest, NextResponse } from "next/server";
import https from "https";

// ─── Persona registry ─────────────────────────────────────────────────────────

export type PersonaId =
  | "elena_vance"
  | "elif_nur"
  | "sovereign_concierge"
  | "marcus_sterling"
  | "alexander_croft"
  | "klaus_weber";

export interface PersonaMeta {
  id: PersonaId;
  name: string;
  gender: "female" | "male";
  eyeColor: string;           // canonical hex
  eyeColorLabel: string;      // human label
  silhouette: string;         // body description for avatar engine
  wardrobeStyle: string;      // clothing description
  voiceId: string;            // Google Cloud TTS voice
  languageCode: string;
  speakingRate: number;
  pitch: number;
}

const PERSONAS: Record<PersonaId, PersonaMeta> = {
  elena_vance: {
    id: "elena_vance",
    name: "Elena Vance",
    gender: "female",
    eyeColor: "#00C853",
    eyeColorLabel: "Luminous Emerald Green",
    silhouette: "Feminine hourglass silhouette, aristocratic facial features, graceful posture",
    wardrobeStyle: "Italian-cut luxury blazer with elegant décolleté, pencil mini skirt, gold/turquoise cyber accessories",
    voiceId: "en-US-Journey-F",
    languageCode: "en-US",
    speakingRate: 1.05,
    pitch: 2.0,
  },
  elif_nur: {
    id: "elif_nur",
    name: "Elif Nur",
    gender: "female",
    eyeColor: "#00C853",
    eyeColorLabel: "Luminous Emerald Green",
    silhouette: "Feminine hourglass silhouette, warm Mediterranean features, expressive presence",
    wardrobeStyle: "Modern luxury blazer with structured shoulders, body-fitting dress with subtle metallic accents",
    voiceId: "tr-TR-Standard-E",
    languageCode: "tr-TR",
    speakingRate: 1.0,
    pitch: 1.5,
  },
  sovereign_concierge: {
    id: "sovereign_concierge",
    name: "Sovereign Concierge",
    gender: "female",
    eyeColor: "#00C853",
    eyeColorLabel: "Luminous Emerald Green",
    silhouette: "Poised and precise, airbrushed digital aesthetic, otherworldly symmetry",
    wardrobeStyle: "All-white precision blazer with NUR Finance monogram, holographic accent details",
    voiceId: "en-US-Wavenet-F",
    languageCode: "en-US",
    speakingRate: 0.95,
    pitch: 3.0,
  },
  marcus_sterling: {
    id: "marcus_sterling",
    name: "Marcus Sterling",
    gender: "male",
    eyeColor: "#1565C0",
    eyeColorLabel: "Ocean Blue",
    silhouette: "Broad-shouldered athletic frame, strong squared jaw, commanding stature",
    wardrobeStyle: "Savile Row 3-piece anthracite suit, waistcoat, silk tie, luxury smart cufflinks",
    voiceId: "en-US-Journey-D",
    languageCode: "en-US",
    speakingRate: 1.0,
    pitch: -2.0,
  },
  alexander_croft: {
    id: "alexander_croft",
    name: "Alexander Croft",
    gender: "male",
    eyeColor: "#00897B",
    eyeColorLabel: "Emerald Green",
    silhouette: "Tall, lean and authoritative, defined angular features, composed gravitas",
    wardrobeStyle: "Navy Savile Row suit with chalk stripe, silver pocket square, understated luxury watch",
    voiceId: "en-GB-Wavenet-B",
    languageCode: "en-GB",
    speakingRate: 0.98,
    pitch: -3.0,
  },
  klaus_weber: {
    id: "klaus_weber",
    name: "Klaus Weber",
    gender: "male",
    eyeColor: "#1976D2",
    eyeColorLabel: "Steel Blue",
    silhouette: "Robust muscular frame, precise Nordic features, disciplined bearing",
    wardrobeStyle: "Charcoal 3-piece German tailored suit, burgundy silk tie, Patek Philippe timepiece",
    voiceId: "de-DE-Wavenet-B",
    languageCode: "de-DE",
    speakingRate: 1.0,
    pitch: -2.5,
  },
};

// ─── Viseme / phoneme mapping ─────────────────────────────────────────────────
// Maps phoneme labels to standard viseme IDs (0–21, compatible with Azure/Web Speech)

const PHONEME_VISEME: Record<string, number> = {
  "sil": 0, "PP": 21, "FF": 18, "TH": 17, "DD": 16, "kk": 20,
  "CH": 15, "SS": 15, "nn": 14, "RR": 13, "aa": 2, "E": 4,
  "I": 6, "O": 8, "U": 7, "ah": 2, "ay": 3, "aw": 11,
  "eh": 4, "er": 5, "ih": 6, "iy": 6, "ow": 8, "uh": 7,
  "uw": 7, "b": 21, "d": 16, "f": 18, "g": 20, "h": 12,
  "jh": 15, "k": 20, "l": 14, "m": 21, "n": 14, "ng": 20,
  "p": 21, "r": 13, "s": 15, "sh": 15, "t": 16, "v": 18,
  "w": 7, "y": 6, "z": 15, "zh": 15,
};

export interface Viseme {
  visemeId: number;
  phoneme: string;
  offsetMs: number;          // time offset from audio start
  durationMs: number;
}

// Simple heuristic viseme generator from text (when Google doesn't return timestamps)
function generateHeuristicVisemes(text: string, audioDurationMs: number): Viseme[] {
  const words = text.split(/\s+/).filter(Boolean);
  const msPerWord = audioDurationMs / Math.max(words.length, 1);
  const visemes: Viseme[] = [];

  let offsetMs = 0;
  for (const word of words) {
    // Map each letter cluster to a rough viseme
    const phonemes = word.toLowerCase().replace(/[^a-z]/g, "").split("");
    const msPerPhoneme = msPerWord / Math.max(phonemes.length, 1);

    for (const ph of phonemes) {
      const key = ph.toUpperCase();
      visemes.push({
        visemeId: PHONEME_VISEME[key] ?? 0,
        phoneme: ph,
        offsetMs: Math.round(offsetMs),
        durationMs: Math.round(msPerPhoneme),
      });
      offsetMs += msPerPhoneme;
    }
    // Short silence between words
    visemes.push({ visemeId: 0, phoneme: "sil", offsetMs: Math.round(offsetMs), durationMs: 40 });
    offsetMs += 40;
  }

  return visemes;
}

// ─── Google Cloud TTS helper ──────────────────────────────────────────────────

interface GoogleTTSRequest {
  input: { text?: string; ssml?: string };
  voice: { languageCode: string; name: string };
  audioConfig: {
    audioEncoding: string;
    speakingRate: number;
    pitch: number;
    effectsProfileId?: string[];
  };
  enableTimePointing?: string[];  // ["SSML_MARK"] for timestamps
}

function googleTTS(payload: GoogleTTSRequest, apiKey: string): Promise<{
  audioContent: string;
  timepoints?: Array<{ markName: string; timeSeconds: number }>;
}> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: "texttospeech.googleapis.com",
      path: `/v1/text:synthesize?key=${apiKey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "NURFinanceTerminal/1.0",
      },
    }, res => {
      let data = "";
      res.on("data", c => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Google TTS parse error: ${data.slice(0, 200)}`)); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── Estimate audio duration from base64 MP3 size ────────────────────────────

function estimateDurationMs(base64: string, format: "mp3" | "wav"): number {
  const bytes = (base64.length * 3) / 4;
  if (format === "wav") {
    // WAV: 44100 Hz, 16-bit, mono ≈ 88200 bytes/s
    return Math.round((bytes / 88200) * 1000);
  }
  // MP3: ~128kbps ≈ 16000 bytes/s
  return Math.round((bytes / 16000) * 1000);
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: {
    text?: string;
    voiceId?: string;
    languageCode?: string;
    speakingRate?: number;
    pitch?: number;
    persona?: PersonaId;
    format?: "mp3" | "wav";
    includeVisemes?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const persona = body.persona ? PERSONAS[body.persona] : null;
  const format = body.format ?? "mp3";
  const apiKey = process.env.GOOGLE_TTS_API_KEY ?? "";

  const voiceId = body.voiceId ?? persona?.voiceId ?? "en-US-Journey-F";
  const languageCode = body.languageCode ?? persona?.languageCode ?? "en-US";
  const speakingRate = body.speakingRate ?? persona?.speakingRate ?? 1.0;
  const pitch = body.pitch ?? persona?.pitch ?? 0.0;

  if (!apiKey) {
    // Stub response when API key not configured
    const stubAudio = Buffer.from("stub-audio").toString("base64");
    return NextResponse.json({
      audioBase64: stubAudio,
      format,
      durationMs: Math.round(body.text.split(/\s+/).length * 350),
      visemes: body.includeVisemes
        ? generateHeuristicVisemes(body.text, Math.round(body.text.split(/\s+/).length * 350))
        : undefined,
      persona: persona ?? null,
      warning: "GOOGLE_TTS_API_KEY not configured — returning stub audio",
    });
  }

  try {
    const ttsRequest: GoogleTTSRequest = {
      input: { text: body.text },
      voice: { languageCode, name: voiceId },
      audioConfig: {
        audioEncoding: format === "mp3" ? "MP3" : "LINEAR16",
        speakingRate,
        pitch,
        effectsProfileId: ["headphone-class-device"],
      },
    };

    const result = await googleTTS(ttsRequest, apiKey);

    if (!result.audioContent) {
      return NextResponse.json({ error: "Google TTS returned empty audio" }, { status: 502 });
    }

    const durationMs = estimateDurationMs(result.audioContent, format);

    let visemes: Viseme[] | undefined;
    if (body.includeVisemes) {
      // Generate heuristic visemes (Google Cloud's timepoints require SSML marks)
      visemes = generateHeuristicVisemes(body.text, durationMs);
    }

    return NextResponse.json({
      audioBase64: result.audioContent,
      format,
      durationMs,
      visemes,
      persona: persona ?? null,
    });
  } catch (err) {
    console.error("[TTS] Error:", (err as Error).message);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// ─── GET: list available personas ─────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    personas: Object.values(PERSONAS).map(p => ({
      id: p.id,
      name: p.name,
      gender: p.gender,
      eyeColor: p.eyeColor,
      eyeColorLabel: p.eyeColorLabel,
      voiceId: p.voiceId,
      languageCode: p.languageCode,
    })),
    visualStandards: {
      female: "Luminous Emerald Green eyes (#00C853) — always, no exceptions",
      male: "Emerald Green (#00897B) or Steel/Ocean Blue (#1565C0) eyes",
    },
  });
}
