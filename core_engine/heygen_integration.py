"""
NUR Finance — HeyGen AI Video Integration

Generates photorealistic AI anchor videos for NUR TV broadcast channels.
Each host has a persistent avatar; scripts are generated per-show and
fed to HeyGen's API to produce broadcast-ready video segments.

Setup:
    pip install httpx pydantic
    export HEYGEN_API_KEY="your-key-here"

Usage:
    from core_engine.heygen_integration import HeyGenClient, NURVideoProducer

    producer = NURVideoProducer()
    video = await producer.produce_segment(
        host_id="host-victoria",
        script="Good morning, this is NUR Finance Global...",
        background="news_studio",
    )
"""

from __future__ import annotations

import os
import asyncio
import logging
from enum import Enum
from dataclasses import dataclass, field
from typing import Optional

import httpx

logger = logging.getLogger("nur.heygen")

HEYGEN_BASE_URL = "https://api.heygen.com"
HEYGEN_API_VERSION = "v2"


class VideoStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class AvatarStyle(str, Enum):
    NORMAL = "normal"
    CIRCLE = "circle"
    CLOSEUP = "closeup"


class BackgroundType(str, Enum):
    NEWS_STUDIO = "news_studio"
    GREEN_SCREEN = "green_screen"
    CUSTOM_IMAGE = "custom_image"
    TRANSPARENT = "transparent"


class VoiceEmotion(str, Enum):
    BROADCASTER = "Broadcaster"
    FRIENDLY = "Friendly"
    SERIOUS = "Serious"
    EXCITED = "Excited"


@dataclass
class AvatarConfig:
    avatar_id: str
    voice_id: str
    language: str = "en-US"
    voice_emotion: VoiceEmotion = VoiceEmotion.BROADCASTER
    speed: float = 1.0
    pitch: float = 0.0


@dataclass
class VideoRequest:
    script: str
    avatar: AvatarConfig
    title: str = ""
    background_type: BackgroundType = BackgroundType.NEWS_STUDIO
    background_url: Optional[str] = None
    width: int = 1920
    height: int = 1080
    test: bool = False


@dataclass
class VideoResult:
    video_id: str
    status: VideoStatus
    video_url: Optional[str] = None
    duration_seconds: Optional[float] = None
    thumbnail_url: Optional[str] = None
    error: Optional[str] = None


# ─── Host-to-Avatar mapping ───────────────────────────────────────
# After creating avatars in HeyGen dashboard (Photo Avatar or
# Instant Avatar), map each NUR host to their avatar + voice IDs.
# Voice IDs come from HeyGen voice library or cloned voices.

HOST_AVATAR_MAP: dict[str, AvatarConfig] = {
    "host-victoria": AvatarConfig(
        avatar_id="",  # Set after creating avatar in HeyGen
        voice_id="",   # British English female voice
        language="en-GB",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-elena": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-GB",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-sarah": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-US",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-maya": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-US",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-defne": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="tr-TR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-zeynep": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="tr-TR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-fatima": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ar-SA",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-nadia": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ar-SA",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-katharina": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="de-DE",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-lena": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="de-DE",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-eloise": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="fr-FR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-camille": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="fr-FR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-misaki": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ja-JP",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-mio": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ja-JP",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-mingyu": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="zh-CN",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-yuhan": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="zh-CN",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-soyeon": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ko-KR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-jiwon": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ko-KR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-ananya": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-IN",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-priya": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-IN",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-isabella": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="pt-BR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-carolina": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="pt-BR",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-valentina": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="es-MX",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-lucia": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="es-MX",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-amara": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-ZA",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-zara": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-ZA",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-mei-lin": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-SG",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-nurul": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="en-SG",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-aisha": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ru-RU",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
    "host-dana": AvatarConfig(
        avatar_id="",
        voice_id="",
        language="ru-RU",
        voice_emotion=VoiceEmotion.BROADCASTER,
    ),
}


class HeyGenClient:
    """Low-level async client for HeyGen REST API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("HEYGEN_API_KEY", "")
        if not self.api_key:
            logger.warning("HEYGEN_API_KEY not set — calls will fail")
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=HEYGEN_BASE_URL,
                headers={
                    "X-Api-Key": self.api_key,
                    "Content-Type": "application/json",
                },
                timeout=60.0,
            )
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ── Avatar Management ──────────────────────────────────────

    async def list_avatars(self) -> list[dict]:
        client = await self._get_client()
        resp = await client.get(f"/{HEYGEN_API_VERSION}/avatars")
        resp.raise_for_status()
        data = resp.json()
        return data.get("data", {}).get("avatars", [])

    async def create_photo_avatar(
        self,
        image_url: str,
        name: str,
    ) -> dict:
        client = await self._get_client()
        resp = await client.post(
            f"/{HEYGEN_API_VERSION}/photo_avatar",
            json={"image_url": image_url, "name": name},
        )
        resp.raise_for_status()
        return resp.json().get("data", {})

    # ── Voice Management ───────────────────────────────────────

    async def list_voices(self, language: Optional[str] = None) -> list[dict]:
        client = await self._get_client()
        params = {}
        if language:
            params["language"] = language
        resp = await client.get(f"/{HEYGEN_API_VERSION}/voices", params=params)
        resp.raise_for_status()
        data = resp.json()
        return data.get("data", {}).get("voices", [])

    # ── Video Generation ───────────────────────────────────────

    async def create_video(self, request: VideoRequest) -> str:
        client = await self._get_client()

        background = {"type": "color", "value": "#0a1628"}
        if request.background_type == BackgroundType.CUSTOM_IMAGE and request.background_url:
            background = {"type": "image", "url": request.background_url}
        elif request.background_type == BackgroundType.GREEN_SCREEN:
            background = {"type": "color", "value": "#00ff00"}
        elif request.background_type == BackgroundType.TRANSPARENT:
            background = {"type": "transparent"}

        payload = {
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": request.avatar.avatar_id,
                        "avatar_style": AvatarStyle.NORMAL.value,
                    },
                    "voice": {
                        "type": "text",
                        "input_text": request.script,
                        "voice_id": request.avatar.voice_id,
                        "speed": request.avatar.speed,
                        "pitch": request.avatar.pitch,
                        "emotion": request.avatar.voice_emotion.value,
                    },
                    "background": background,
                }
            ],
            "dimension": {
                "width": request.width,
                "height": request.height,
            },
            "test": request.test,
        }
        if request.title:
            payload["title"] = request.title

        resp = await client.post(
            f"/{HEYGEN_API_VERSION}/video/generate",
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()
        video_id = data.get("data", {}).get("video_id", "")
        logger.info("Video created: %s", video_id)
        return video_id

    async def get_video_status(self, video_id: str) -> VideoResult:
        client = await self._get_client()
        resp = await client.get(
            f"/{HEYGEN_API_VERSION}/video_status.get",
            params={"video_id": video_id},
        )
        resp.raise_for_status()
        data = resp.json().get("data", {})

        status_map = {
            "pending": VideoStatus.PENDING,
            "processing": VideoStatus.PROCESSING,
            "completed": VideoStatus.COMPLETED,
            "failed": VideoStatus.FAILED,
        }

        return VideoResult(
            video_id=video_id,
            status=status_map.get(data.get("status", ""), VideoStatus.PENDING),
            video_url=data.get("video_url"),
            duration_seconds=data.get("duration"),
            thumbnail_url=data.get("thumbnail_url"),
            error=data.get("error"),
        )

    async def wait_for_video(
        self,
        video_id: str,
        poll_interval: float = 10.0,
        timeout: float = 600.0,
    ) -> VideoResult:
        elapsed = 0.0
        while elapsed < timeout:
            result = await self.get_video_status(video_id)
            if result.status in (VideoStatus.COMPLETED, VideoStatus.FAILED):
                return result
            logger.info("Video %s status: %s (%.0fs)", video_id, result.status, elapsed)
            await asyncio.sleep(poll_interval)
            elapsed += poll_interval
        raise TimeoutError(f"Video {video_id} did not complete within {timeout}s")

    # ── Streaming Avatar (Interactive) ─────────────────────────

    async def create_streaming_session(self, avatar_id: str, voice_id: str) -> dict:
        client = await self._get_client()
        resp = await client.post(
            f"/{HEYGEN_API_VERSION}/streaming.new",
            json={
                "avatar_id": avatar_id,
                "voice": {"voice_id": voice_id},
                "quality": "high",
            },
        )
        resp.raise_for_status()
        return resp.json().get("data", {})

    async def send_streaming_text(self, session_id: str, text: str) -> dict:
        client = await self._get_client()
        resp = await client.post(
            f"/{HEYGEN_API_VERSION}/streaming.task",
            json={"session_id": session_id, "text": text},
        )
        resp.raise_for_status()
        return resp.json().get("data", {})

    async def close_streaming_session(self, session_id: str) -> None:
        client = await self._get_client()
        await client.post(
            f"/{HEYGEN_API_VERSION}/streaming.stop",
            json={"session_id": session_id},
        )


class NURVideoProducer:
    """High-level producer: takes a host ID + script, returns a video."""

    def __init__(self, api_key: Optional[str] = None):
        self.client = HeyGenClient(api_key)

    async def close(self) -> None:
        await self.client.close()

    def get_avatar_config(self, host_id: str) -> AvatarConfig:
        config = HOST_AVATAR_MAP.get(host_id)
        if not config:
            raise ValueError(f"No avatar mapping for host: {host_id}")
        if not config.avatar_id:
            raise ValueError(
                f"Avatar ID not configured for {host_id}. "
                "Create a Photo Avatar in HeyGen dashboard, then set avatar_id in HOST_AVATAR_MAP."
            )
        return config

    async def produce_segment(
        self,
        host_id: str,
        script: str,
        title: str = "",
        background: str = "news_studio",
        test: bool = False,
    ) -> VideoResult:
        avatar = self.get_avatar_config(host_id)

        bg_type = {
            "news_studio": BackgroundType.NEWS_STUDIO,
            "green_screen": BackgroundType.GREEN_SCREEN,
            "transparent": BackgroundType.TRANSPARENT,
        }.get(background, BackgroundType.NEWS_STUDIO)

        request = VideoRequest(
            script=script,
            avatar=avatar,
            title=title or f"NUR-{host_id}-segment",
            background_type=bg_type,
            test=test,
        )

        video_id = await self.client.create_video(request)
        result = await self.client.wait_for_video(video_id)

        if result.status == VideoStatus.FAILED:
            logger.error("Video generation failed: %s", result.error)
        else:
            logger.info("Video ready: %s (%.1fs)", result.video_url, result.duration_seconds or 0)

        return result

    async def produce_breaking_news(
        self,
        host_id: str,
        headline: str,
        details: str,
        test: bool = False,
    ) -> VideoResult:
        script = (
            f"Breaking news just in. {headline}. {details}. "
            "We'll continue to monitor this story and bring you updates as they develop. "
            "Stay with NUR Finance for full coverage."
        )
        return await self.produce_segment(
            host_id=host_id,
            script=script,
            title=f"BREAKING-{headline[:40]}",
            test=test,
        )

    async def produce_market_open(
        self,
        host_id: str,
        market_data: dict,
        test: bool = False,
    ) -> VideoResult:
        index = market_data.get("index", "the market")
        change = market_data.get("change", "0.0%")
        direction = "higher" if not change.startswith("-") else "lower"
        highlights = market_data.get("highlights", "")

        script = (
            f"Good morning and welcome to NUR Finance. "
            f"Let's take a look at how markets are shaping up. "
            f"{index} is trading {direction}, {change} in early trade. "
            f"{highlights} "
            f"Let's dive deeper into what's driving the action today."
        )
        return await self.produce_segment(
            host_id=host_id,
            script=script,
            title=f"MarketOpen-{index}",
            test=test,
        )

    async def produce_market_close(
        self,
        host_id: str,
        summary: dict,
        test: bool = False,
    ) -> VideoResult:
        index = summary.get("index", "the market")
        close_price = summary.get("close", "")
        change = summary.get("change", "")
        movers = summary.get("top_movers", "")

        script = (
            f"That's a wrap on today's session. "
            f"{index} closed at {close_price}, {change} on the day. "
            f"Top movers today: {movers}. "
            f"Looking ahead to tomorrow, we'll be watching for key data releases. "
            f"Thank you for watching NUR Finance. See you next session."
        )
        return await self.produce_segment(
            host_id=host_id,
            script=script,
            title=f"MarketClose-{index}",
            test=test,
        )

    async def start_live_stream(self, host_id: str) -> dict:
        avatar = self.get_avatar_config(host_id)
        session = await self.client.create_streaming_session(
            avatar.avatar_id, avatar.voice_id
        )
        logger.info("Streaming session started: %s", session.get("session_id"))
        return session

    async def send_live_line(self, session_id: str, text: str) -> dict:
        return await self.client.send_streaming_text(session_id, text)

    async def end_live_stream(self, session_id: str) -> None:
        await self.client.close_streaming_session(session_id)
        logger.info("Streaming session ended: %s", session_id)


# ─── CLI helper ────────────────────────────────────────────────

async def _demo():
    producer = NURVideoProducer()
    try:
        print("Available hosts:", list(HOST_AVATAR_MAP.keys()))
        print("\nTo generate a test video:")
        print('  result = await producer.produce_segment(')
        print('      host_id="host-victoria",')
        print('      script="Welcome to NUR Finance Global...",')
        print('      test=True,')
        print("  )")
        print("\nSet HEYGEN_API_KEY and avatar_id/voice_id in HOST_AVATAR_MAP first.")
    finally:
        await producer.close()


if __name__ == "__main__":
    asyncio.run(_demo())
