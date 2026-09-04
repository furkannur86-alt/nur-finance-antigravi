"""
NUR Finance — Text-to-Speech Engine

Multi-backend TTS priority:
  1. Piper TTS (offline ONNX) — highest quality, human-indistinguishable
  2. Google Neural TTS (via translate.googleapis.com) — natural human voice
  3. edge-tts (Azure Neural) — high quality but requires WebSocket
  4. espeak-ng (offline) — robotic fallback, always available
"""

from __future__ import annotations

import asyncio
import os
import ssl
import subprocess
import logging
import urllib.parse
import urllib.request
import tempfile
from dataclasses import dataclass, field

logger = logging.getLogger("nur.tts")

GOOGLE_TTS_URL = "https://translate.googleapis.com/translate_tts"
GOOGLE_TTS_MAX_CHARS = 200

PIPER_MODELS_DIR = os.environ.get("PIPER_MODELS_DIR", os.path.join(os.path.expanduser("~"), "piper_models"))

PIPER_VOICE_MAP: dict[str, str] = {
    "en": "en_US-lessac-medium",
    "tr": "tr_TR-dfki-medium",
    "ar": "ar_JO-kareem-medium",
    "de": "de_DE-thorsten-medium",
    "fr": "fr_FR-siwis-medium",
    "ja": "ja_JP-kokoro-medium",
    "zh-CN": "zh_CN-huayan-medium",
    "ko": "ko_KR-kagamine_rin-medium",
    "hi": "hi_IN-madhur-medium",
    "pt": "pt_BR-faber-medium",
    "es": "es_MX-ald-medium",
    "ru": "ru_RU-denis-medium",
    "en-gb": "en_GB-cori-medium",
}

_ssl_ctx: ssl.SSLContext | None = None

def _get_ssl_ctx() -> ssl.SSLContext:
    global _ssl_ctx
    if _ssl_ctx is None:
        _ssl_ctx = ssl.create_default_context()
        ca_path = "/root/.ccr/ca-bundle.crt"
        if os.path.exists(ca_path):
            _ssl_ctx.load_verify_locations(ca_path)
    return _ssl_ctx


@dataclass
class VoiceConfig:
    voice_id: str
    language: str
    rate: str = "+0%"
    pitch: str = "+0Hz"
    espeak_voice: str = ""
    google_lang: str = ""


CHANNEL_VOICES: dict[str, VoiceConfig] = {
    "nur-global":  VoiceConfig("en-GB-SoniaNeural", "en-GB", espeak_voice="en-gb", google_lang="en"),
    "nur-usa":     VoiceConfig("en-US-JennyNeural", "en-US", espeak_voice="en-us", google_lang="en"),
    "nur-turkey":  VoiceConfig("tr-TR-EmelNeural", "tr-TR", espeak_voice="tr", google_lang="tr"),
    "nur-arabic":  VoiceConfig("ar-SA-ZariyahNeural", "ar-SA", espeak_voice="ar", google_lang="ar"),
    "nur-deutsch": VoiceConfig("de-DE-KatjaNeural", "de-DE", espeak_voice="de", google_lang="de"),
    "nur-france":  VoiceConfig("fr-FR-DeniseNeural", "fr-FR", espeak_voice="fr", google_lang="fr"),
    "nur-japan":   VoiceConfig("ja-JP-NanamiNeural", "ja-JP", espeak_voice="ja", google_lang="ja"),
    "nur-china":   VoiceConfig("zh-CN-XiaoxiaoNeural", "zh-CN", espeak_voice="cmn", google_lang="zh-CN"),
    "nur-korea":   VoiceConfig("ko-KR-SunHiNeural", "ko-KR", espeak_voice="ko", google_lang="ko"),
    "nur-india":   VoiceConfig("hi-IN-SwaraNeural", "hi-IN", espeak_voice="hi", google_lang="hi"),
    "nur-brazil":  VoiceConfig("pt-BR-FranciscaNeural", "pt-BR", espeak_voice="pt", google_lang="pt"),
    "nur-latam":   VoiceConfig("es-MX-DaliaNeural", "es-MX", espeak_voice="es-419", google_lang="es"),
    "nur-africa":  VoiceConfig("en-ZA-LeahNeural", "en-ZA", espeak_voice="en-za", google_lang="en"),
    "nur-sea":     VoiceConfig("en-SG-LunaNeural", "en-SG", espeak_voice="en", google_lang="en"),
    "nur-eurasia": VoiceConfig("ru-RU-SvetlanaNeural", "ru-RU", espeak_voice="ru", google_lang="ru"),
}

ANCHOR_VOICES: dict[str, VoiceConfig] = {
    "host-victoria":  VoiceConfig("en-GB-SoniaNeural", "en-GB", espeak_voice="en-gb", google_lang="en"),
    "host-elena":     VoiceConfig("en-GB-MaisieNeural", "en-GB", espeak_voice="en-gb", google_lang="en"),
    "host-sarah":     VoiceConfig("en-US-JennyNeural", "en-US", espeak_voice="en-us", google_lang="en"),
    "host-maya":      VoiceConfig("en-US-AriaNeural", "en-US", espeak_voice="en-us", google_lang="en"),
    "host-defne":     VoiceConfig("tr-TR-EmelNeural", "tr-TR", espeak_voice="tr", google_lang="tr"),
    "host-zeynep":    VoiceConfig("tr-TR-EmelNeural", "tr-TR", rate="-5%", espeak_voice="tr", google_lang="tr"),
    "host-fatima":    VoiceConfig("ar-SA-ZariyahNeural", "ar-SA", espeak_voice="ar", google_lang="ar"),
    "host-nadia":     VoiceConfig("ar-SA-ZariyahNeural", "ar-SA", rate="-5%", espeak_voice="ar", google_lang="ar"),
    "host-katharina": VoiceConfig("de-DE-KatjaNeural", "de-DE", espeak_voice="de", google_lang="de"),
    "host-lena":      VoiceConfig("de-DE-AmalaNeural", "de-DE", espeak_voice="de", google_lang="de"),
    "host-eloise":    VoiceConfig("fr-FR-DeniseNeural", "fr-FR", espeak_voice="fr", google_lang="fr"),
    "host-camille":   VoiceConfig("fr-FR-EloiseNeural", "fr-FR", espeak_voice="fr", google_lang="fr"),
    "host-misaki":    VoiceConfig("ja-JP-NanamiNeural", "ja-JP", espeak_voice="ja", google_lang="ja"),
    "host-mio":       VoiceConfig("ja-JP-NanamiNeural", "ja-JP", rate="-5%", espeak_voice="ja", google_lang="ja"),
    "host-mingyu":    VoiceConfig("zh-CN-XiaoxiaoNeural", "zh-CN", espeak_voice="cmn", google_lang="zh-CN"),
    "host-yuhan":     VoiceConfig("zh-CN-XiaohanNeural", "zh-CN", espeak_voice="cmn", google_lang="zh-CN"),
    "host-soyeon":    VoiceConfig("ko-KR-SunHiNeural", "ko-KR", espeak_voice="ko", google_lang="ko"),
    "host-jiwon":     VoiceConfig("ko-KR-SunHiNeural", "ko-KR", rate="-5%", espeak_voice="ko", google_lang="ko"),
    "host-ananya":    VoiceConfig("hi-IN-SwaraNeural", "hi-IN", espeak_voice="hi", google_lang="hi"),
    "host-priya":     VoiceConfig("en-IN-NeerjaNeural", "en-IN", espeak_voice="en", google_lang="hi"),
    "host-isabella":  VoiceConfig("pt-BR-FranciscaNeural", "pt-BR", espeak_voice="pt", google_lang="pt"),
    "host-carolina":  VoiceConfig("pt-BR-FranciscaNeural", "pt-BR", rate="-5%", espeak_voice="pt", google_lang="pt"),
    "host-valentina": VoiceConfig("es-MX-DaliaNeural", "es-MX", espeak_voice="es-419", google_lang="es"),
    "host-lucia":     VoiceConfig("es-MX-DaliaNeural", "es-MX", rate="-5%", espeak_voice="es-419", google_lang="es"),
    "host-amara":     VoiceConfig("en-ZA-LeahNeural", "en-ZA", espeak_voice="en-za", google_lang="en"),
    "host-zara":      VoiceConfig("en-ZA-LeahNeural", "en-ZA", rate="-5%", espeak_voice="en-za", google_lang="en"),
    "host-mei-lin":   VoiceConfig("en-SG-LunaNeural", "en-SG", espeak_voice="en", google_lang="en"),
    "host-nurul":     VoiceConfig("en-SG-LunaNeural", "en-SG", rate="-5%", espeak_voice="en", google_lang="en"),
    "host-aisha":     VoiceConfig("ru-RU-SvetlanaNeural", "ru-RU", espeak_voice="ru", google_lang="ru"),
    "host-dana":      VoiceConfig("ru-RU-SvetlanaNeural", "ru-RU", rate="-5%", espeak_voice="ru", google_lang="ru"),
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


def _chunk_text(text: str, max_chars: int = GOOGLE_TTS_MAX_CHARS) -> list[str]:
    """Split text into chunks at sentence boundaries."""
    sentences = []
    current = ""
    for part in text.replace(". ", ".|").replace("? ", "?|").replace("! ", "!|").split("|"):
        part = part.strip()
        if not part:
            continue
        if len(current) + len(part) + 1 <= max_chars:
            current = f"{current} {part}".strip() if current else part
        else:
            if current:
                sentences.append(current)
            current = part[:max_chars] if len(part) > max_chars else part
    if current:
        sentences.append(current)
    return sentences or [text[:max_chars]]


def _fetch_tts_chunk(url: str, retries: int = 3) -> bytes:
    """Fetch a single TTS audio chunk with retry logic."""
    import time
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://translate.googleapis.com/",
            })
            with urllib.request.urlopen(req, context=_get_ssl_ctx(), timeout=15) as resp:
                data = resp.read()
                if len(data) < 100:
                    raise ValueError(f"Audio too small ({len(data)} bytes)")
                return data
        except Exception as e:
            last_err = e
            if attempt < retries - 1:
                time.sleep(1.0 * (attempt + 1))
                logger.warning("TTS chunk retry %d/%d: %s", attempt + 1, retries, e)
    raise RuntimeError(f"TTS fetch failed after {retries} attempts: {last_err}")


def _find_piper_model(lang: str) -> str | None:
    """Find a Piper ONNX model file for the given language."""
    model_name = PIPER_VOICE_MAP.get(lang) or PIPER_VOICE_MAP.get(lang.split("-")[0])
    if not model_name:
        return None
    onnx_path = os.path.join(PIPER_MODELS_DIR, f"{model_name}.onnx")
    if os.path.exists(onnx_path):
        return onnx_path
    for sub in os.listdir(PIPER_MODELS_DIR) if os.path.isdir(PIPER_MODELS_DIR) else []:
        candidate = os.path.join(PIPER_MODELS_DIR, sub, f"{model_name}.onnx")
        if os.path.exists(candidate):
            return candidate
    return None


def generate_speech_piper(
    text: str,
    output_path: str,
    voice: VoiceConfig | None = None,
    channel_id: str | None = None,
    host_id: str | None = None,
) -> str:
    """Piper TTS — offline ONNX neural voice, highest quality."""
    v = _resolve_voice(voice, channel_id, host_id)
    lang = v.google_lang or v.language.split("-")[0]
    model_path = _find_piper_model(lang)
    if not model_path:
        raise FileNotFoundError(f"No Piper model for language '{lang}' in {PIPER_MODELS_DIR}")

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    wav_path = output_path.rsplit(".", 1)[0] + "_piper.wav"

    piper_bin = os.environ.get("PIPER_BIN", "piper")
    cmd = [piper_bin, "--model", model_path, "--output_file", wav_path]
    result = subprocess.run(
        cmd, input=text, capture_output=True, text=True, timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Piper failed: {result.stderr.strip()}")
    if not os.path.exists(wav_path) or os.path.getsize(wav_path) < 100:
        raise RuntimeError("Piper produced no output")

    if output_path.endswith(".mp3"):
        subprocess.run(
            ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-b:a", "192k", output_path],
            capture_output=True, check=True,
        )
        os.remove(wav_path)
    else:
        os.rename(wav_path, output_path)

    logger.info("TTS saved: %s (%s via piper)", output_path, os.path.basename(model_path))
    return output_path


def generate_speech_google(
    text: str,
    output_path: str,
    voice: VoiceConfig | None = None,
    channel_id: str | None = None,
    host_id: str | None = None,
) -> str:
    """Google Neural TTS via translate.googleapis.com — natural human-quality voice."""
    v = _resolve_voice(voice, channel_id, host_id)
    lang = v.google_lang or v.language.split("-")[0]
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    chunks = _chunk_text(text)
    audio_parts: list[bytes] = []

    for i, chunk in enumerate(chunks):
        url = (
            f"{GOOGLE_TTS_URL}?ie=UTF-8"
            f"&q={urllib.parse.quote(chunk)}"
            f"&tl={lang}"
            f"&client=tw-ob"
        )
        audio_parts.append(_fetch_tts_chunk(url))

    if len(audio_parts) == 1:
        with open(output_path, "wb") as f:
            f.write(audio_parts[0])
    else:
        with tempfile.TemporaryDirectory() as td:
            part_files = []
            for i, part in enumerate(audio_parts):
                pf = os.path.join(td, f"part_{i:03d}.mp3")
                with open(pf, "wb") as f:
                    f.write(part)
                part_files.append(pf)
            concat_list = os.path.join(td, "concat.txt")
            with open(concat_list, "w") as f:
                for pf in part_files:
                    f.write(f"file '{pf}'\n")
            subprocess.run(
                ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list,
                 "-codec:a", "libmp3lame", "-b:a", "128k", output_path],
                capture_output=True, check=True,
            )

    logger.info("TTS saved: %s (%s via google-neural)", output_path, lang)
    return output_path


def generate_speech_espeak(
    text: str,
    output_path: str,
    voice: VoiceConfig | None = None,
    channel_id: str | None = None,
    host_id: str | None = None,
    speed: int = 150,
) -> str:
    """Offline espeak-ng fallback — robotic but always available."""
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


def generate_speech_auto(
    text: str,
    output_path: str,
    voice: VoiceConfig | None = None,
    channel_id: str | None = None,
    host_id: str | None = None,
) -> str:
    """Try Piper → Google Neural → espeak-ng."""
    try:
        return generate_speech_piper(text, output_path, voice, channel_id, host_id)
    except Exception as e:
        logger.info("Piper TTS unavailable (%s), trying Google Neural", e)

    try:
        return generate_speech_google(text, output_path, voice, channel_id, host_id)
    except Exception as e:
        logger.warning("Google TTS failed (%s), falling back to espeak-ng", e)
        return generate_speech_espeak(text, output_path, voice, channel_id, host_id)


async def generate_speech(
    text: str,
    output_path: str,
    voice: VoiceConfig | None = None,
    channel_id: str | None = None,
    host_id: str | None = None,
) -> str:
    """Async TTS: tries Piper → edge-tts → Google Neural → espeak-ng."""
    v = _resolve_voice(voice, channel_id, host_id)
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    try:
        return generate_speech_piper(text, output_path, v)
    except Exception:
        pass

    try:
        import edge_tts
        communicate = edge_tts.Communicate(text, v.voice_id, rate=v.rate, pitch=v.pitch)
        await communicate.save(output_path)
        logger.info("TTS saved: %s (%s via edge-tts)", output_path, v.voice_id)
        return output_path
    except Exception as e:
        logger.warning("edge-tts failed (%s), trying Google Neural", e)

    try:
        return generate_speech_google(text, output_path, v)
    except Exception as e:
        logger.warning("Google TTS failed (%s), falling back to espeak-ng", e)
        return generate_speech_espeak(text, output_path, v)


def health_check() -> dict:
    """Run diagnostics on all TTS backends and languages."""
    import time
    results: dict = {"backends": {}, "languages": {}, "overall": "unknown"}

    # Check Piper TTS
    piper_bin = os.environ.get("PIPER_BIN", "piper")
    try:
        subprocess.run([piper_bin, "--version"], capture_output=True, check=True, timeout=10)
        models_found = []
        if os.path.isdir(PIPER_MODELS_DIR):
            for f in os.listdir(PIPER_MODELS_DIR):
                if f.endswith(".onnx"):
                    models_found.append(f)
            for sub in os.listdir(PIPER_MODELS_DIR):
                sub_path = os.path.join(PIPER_MODELS_DIR, sub)
                if os.path.isdir(sub_path):
                    for f in os.listdir(sub_path):
                        if f.endswith(".onnx"):
                            models_found.append(f)
        results["backends"]["piper"] = f"ok ({len(models_found)} models)"
        results["piper_models"] = models_found
    except FileNotFoundError:
        results["backends"]["piper"] = "not installed"
    except Exception as e:
        results["backends"]["piper"] = f"fail: {e}"

    # Check espeak-ng
    try:
        subprocess.run(["espeak-ng", "--version"], capture_output=True, check=True)
        results["backends"]["espeak-ng"] = "ok"
    except Exception as e:
        results["backends"]["espeak-ng"] = f"fail: {e}"

    # Check Google Neural TTS connectivity
    try:
        test_url = f"{GOOGLE_TTS_URL}?ie=UTF-8&q=test&tl=en&client=tw-ob"
        data = _fetch_tts_chunk(test_url, retries=1)
        results["backends"]["google-neural"] = f"ok ({len(data)} bytes)"
    except Exception as e:
        results["backends"]["google-neural"] = f"fail: {e}"

    # Check ffmpeg
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        results["backends"]["ffmpeg"] = "ok"
    except Exception as e:
        results["backends"]["ffmpeg"] = f"fail: {e}"

    # Test each language
    test_phrases = {
        "en": "Test.", "tr": "Test.", "ar": "اختبار.", "de": "Test.",
        "fr": "Test.", "ja": "テスト。", "zh-CN": "测试。", "ko": "테스트.",
        "hi": "परीक्षण।", "pt": "Teste.", "es": "Prueba.",
    }
    for lang, phrase in test_phrases.items():
        try:
            url = f"{GOOGLE_TTS_URL}?ie=UTF-8&q={urllib.parse.quote(phrase)}&tl={lang}&client=tw-ob"
            data = _fetch_tts_chunk(url, retries=1)
            results["languages"][lang] = f"ok ({len(data)}B)"
        except Exception as e:
            results["languages"][lang] = f"fail: {e}"

    ok_langs = sum(1 for v in results["languages"].values() if v.startswith("ok"))
    piper_ok = results["backends"].get("piper", "").startswith("ok")
    google_ok = results["backends"].get("google-neural", "").startswith("ok")
    espeak_ok = results["backends"].get("espeak-ng", "").startswith("ok")
    ffmpeg_ok = results["backends"].get("ffmpeg", "").startswith("ok")

    if piper_ok and ffmpeg_ok:
        results["overall"] = "healthy (piper primary)"
    elif google_ok and ffmpeg_ok and ok_langs == len(test_phrases):
        results["overall"] = "healthy (google-neural primary)"
    elif espeak_ok and ffmpeg_ok:
        results["overall"] = "degraded (espeak-ng fallback only)"
    else:
        results["overall"] = "unhealthy"

    return results


if __name__ == "__main__":
    path = generate_speech_auto(
        "Good morning, this is NUR Finance Global. Markets are opening higher across Europe.",
        "output/demo_tts.mp3",
        channel_id="nur-global",
    )
    print(f"Generated: {path}")
