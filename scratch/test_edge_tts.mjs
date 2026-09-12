import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "fs";

async function test() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("tr-TR-EmelNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const text = "İyi günler sayın seyirciler. Nur Finans Küresel Piyasa Masası'ndan canlı yayınımız başlıyor. Ben Umay Nur.";
  console.log("Synthesizing Turkish neural speech...");
  
  const { audioStream } = tts.toStream(text, {
    rate: "+22%",
    pitch: "+0Hz"
  });

  const chunks = [];
  audioStream.on("data", (chunk) => chunks.push(chunk));
  audioStream.on("end", () => {
    const buffer = Buffer.concat(chunks);
    console.log(`Success! Synthesized ${buffer.length} bytes of studio neural audio.`);
    fs.writeFileSync("scratch/test_emel.mp3", buffer);
    process.exit(0);
  });
  audioStream.on("error", (err) => {
    console.error("TTS Error:", err);
    process.exit(1);
  });
}

test().catch(console.error);
