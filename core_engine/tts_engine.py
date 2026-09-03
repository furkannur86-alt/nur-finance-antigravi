"""
NUR Finance — Text-to-Speech Engine

Multi-backend TTS: tries edge-tts (Azure Neural, free) first,
falls back to espeak-ng (offline, always available).
"""

from __future__ import annotations

import asyncio
import os
import subprocess
import logging
from dataclasses import dataclass

logger = logging.getLogger("nur.tts")

@dataclass
class VoiceConfig:
    voice_id: str
    language: str
    rate: str = "+0%"
    pitch: str = "+0Hz"
    espeak_voice: str = ""


CHANNEL_VOICES: dict[str, VoiceConfig] = {
    "nur-global":  VoiceConfig("en-GB-SoniaNeural", "en-GB", espeak_voice="en-gb"),
    "nur-usa":     VoiceConfig("en-US-JennyNeural", "en-US", espeak_voice="en-us"),
    "nur-turkey":  VoiceConfig("tr-TR-EmelNeural", "tr-TR", espeak_voice="tr"),
    "nur-arabic":  VoiceConfig("ar-SA-ZariyahNeural", "ar-SA", espeak_voice="ar"),
    "nur-deutsch": VoiceConfig("de-DE-KatjaNeural", "de-DE", espeak_voice="de"),
    "nur-france":  VoiceConfig("fr-FR-DeniseNeural", "fr-FR", espeak_voice="fr"),
    "nur-japan":   VoiceConfig("ja-JP-NanamiNeural", "ja-JP", espeak_voice="ja"),
    "nur-china":   VoiceConfig("zh-CN-XiaoxiaoNeural", "zh-CN", espeak_voice="cmn"),
    "nur-korea":   VoiceConfig("ko-KR-SunHiNeural", "ko-KR", espeak_voice="ko"),
    "nur-india":   VoiceConfig("hi-IN-SwaraNeural", "hi-IN", espeak_voice="hi"),
    "nur-brazil":  VoiceConfig("pt-BR-FranciscaNeural", "pt-BR", espeak_voice="pt"),
    "nur-latam":   VoiceConfig("es-MX-DaliaNeural", "es-MX", espeak_voice="es-419"),
    "nur-africa":  VoiceConfig("en-ZA-LeahNeural", "en-ZA", espeak_voice="en-za"),
    "nur-sea":     VoiceConfig("en-SG-LunaNeural", "en-SG", espeak_voice="en"),
    "nur-eurasia": VoiceConfig("ru-RU-SvetlanaNeural", "ru-RU", espeak_voice="ru"),
}

ANCHOR_VOICES: dict[str, VoiceConfig] = {
    "host-victoria":  VoiceConfig("en-GB-SoniaNeural", "en-GB", espeak_voice="en-gb"),
    "host-elena":     VoiceConfig("en-GB-MaisieNeural", "en-GB", espeak_voice="en-gb"),
    "host-sarah":     VoiceConfig("en-US-JennyNeural", "en-US", espeak_voice="en-us"),
    "host-maya":      VoiceConfig("en-US-AriaNeural", "en-US", espeak_voice="en-us"),
    "host-defne":     VoiceConfig("tr-TR-EmelNeural", "tr-TR", espeak_voice="tr"),
    "host-zeynep":    VoiceConfig("tr-TR-EmelNeural", "tr-TR", rate="-5%", espeak_voice="tr"),
    "host-fatima":    VoiceConfig("ar-SA-ZariyahNeural", "ar-SA", espeak_voice="ar"),
    "host-nadia":     VoiceConfig("ar-SA-ZariyahNeural", "ar-SA", rate="-5%", espeak_voice="ar"),
    "host-katharina": VoiceConfig("de-DE-KatjaNeural", "de-DE", espeak_voice="de"),
    "host-lena":      VoiceConfig("de-DE-AmalaNeural", "de-DE", espeak_voice="de"),
    "host-eloise":    VoiceConfig("fr-FR-DeniseNeural", "fr-FR", espeak_voice="fr"),
    "host-camille":   VoiceConfig("fr-FR-EloiseNeural", "fr-FR", espeak_voice="fr"),
    "host-misaki":    VoiceConfig("ja-JP-NanamiNeural", "ja-JP", espeak_voice="ja"),
    "host-mio":       VoiceConfig("ja-JP-NanamiNeural", "ja-JP", rate="-5%", espeak_voice="ja"),
    "host-mingyu":    VoiceConfig("zh-CN-XiaoxiaoNeural", "zh-CN", espeak_voice="cmn"),
    "host-yuhan":     VoiceConfig("zh-CN-XiaohanNeural", "zh-CN", espeak_voice="cmn"),
    "host-soyeon":    VoiceConfig("ko-KR-SunHiNeural", "ko-KR", espeak_voice="ko"),
    "host-jiwon":     VoiceConfig("ko-KR-SunHiNeural", "ko-KR", rate="-5%", espeak_voice="ko"),
    "host-ananya":    VoiceConfig("hi-IN-SwaraNeural", "hi-IN", espeak_voice="hi"),
    "host-priya":     VoiceConfig("en-IN-NeerjaNeural", "en-IN", espeak_voice="en"),
    "host-isabella":  VoiceConfig("pt-BR-FranciscaNeural", "pt-BR", espeak_voice="pt"),
    "host-carolina":  VoiceConfig("pt-BR-FranciscaNeural", "pt-BR", rate="-5%", espeak_voice="pt"),
    "host-valentina": VoiceConfig("es-MX-DaliaNeural", "es-MX", espeak_voice="es-419"),
    "host-lucia":     VoiceConfig("es-MX-DaliaNeural", "es-MX", rate="-5%", espeak_voice="es-419"),
    "host-amara":     VoiceConfig("en-ZA-LeahNeural", "en-ZA", espeak_voice="en-za"),
    "host-zara":      VoiceConfig("en-ZA-LeahNeural", "en-ZA", rate="-5%", espeak_voice="en-za"),
    "host-mei-lin":   VoiceConfig("en-SG-LunaNeural", "en-SG", espeak_voice="en"),
    "host-nurul":     VoiceConfig("en-SG-LunaNeural", "en-SG", rate="-5%", espeak_voice="en"),
    "host-aisha":     VoiceConfig("ru-RU-SvetlanaNeural", "ru-RU", espeak_voice="ru"),
    "host-dana":      VoiceConfig("ru-RU-SvetlanaNeural", "ru-RU", rate="-5%", espeak_voice="ru"),
}


def _resolve_voice(
    voice: VoiceConfig | None,
    channel_id: str | None,
    host_id: str | None,
) -> VoiceConfig:
    if voice is not None:
        return voice
    if host_id and host_id in ANCHOR_VOICES:
        return ANCHOR_VOICES[host_id]
    if channel_id and channel_id in CHANNEL_VOICES:
        return CHANNEL_VOICES[channel_id]
    return CHANNEL_VOICES["nur-global"]


def generate_speech_espeak(
    text: str,
    output_path: str,
    voice: VoiceConfig | None = None,
    channel_id: str | None = None,
    host_id: str | None = None,
    speed: int = 150,
) -> str:
    v = _resolve_voice(voice, channel_id, host_id)
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    wav_path = output_path.rsplit(".", 1)[0] + ".wav"
    cmd = [
        "espeak-ng",
        "-v", v.espeak_voice or v.language.split("-")[0],
        "-s", str(speed),
        "-w", wav_path,
        text,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        logger.error("espeak-ng failed: %s", result.stderr)
        raise RuntimeError(f"espeak-ng failed: {result.stderr}")

    if output_path.endswith(".mp3"):
        mp3_cmd = ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-b:a", "128k", output_path]
        subprocess.run(mp3_cmd, capture_output=True, check=True)
        os.remove(wav_path)
    else:
        if wav_path != output_path:
            os.rename(wav_path, output_path)

    logger.info("TTS saved: %s (%s via espeak-ng)", output_path, v.espeak_voice)
    return output_path


async def generate_speech(
    text: str,
    output_path: str,
    voice: VoiceConfig | None = None,
    channel_id: str | None = None,
    host_id: str | None = None,
) -> str:
    v = _resolve_voice(voice, channel_id, host_id)
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    try:
        import edge_tts
        communicate = edge_tts.Communicate(
            text,
            v.voice_id,
            rate=v.rate,
            pitch=v.pitch,
        )
        await communicate.save(output_path)
        logger.info("TTS saved: %s (%s via edge-tts)", output_path, v.voice_id)
        return output_path
    except Exception as e:
        logger.warning("edge-tts failed (%s), falling back to espeak-ng", e)
        return generate_speech_espeak(text, output_path, v)


if __name__ == "__main__":
    async def _demo():
        path = await generate_speech(
            "Good morning, this is NUR Finance Global. Markets are opening higher across Europe.",
            "output/demo_tts.mp3",
            channel_id="nur-global",
        )
        print(f"Generated: {path}")

    asyncio.run(_demo())
