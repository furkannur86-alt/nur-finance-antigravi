"""
NUR Finance — Broadcast Video Composer

Generates 1-minute broadcast summary videos:
  1. TTS audio from script (edge-tts)
  2. Broadcast frame (Pillow): studio background + lower-third + ticker + clock
  3. Combines into MP4 (ffmpeg): static frame + audio → H.264/AAC

Output: 1920x1080, 30fps, ~400-600KB per 60s video.
"""

from __future__ import annotations

import asyncio
import json
import os
import shutil
import subprocess
import logging
import tempfile
from datetime import datetime, timezone
from PIL import Image, ImageDraw, ImageFont

from core_engine.tts_engine import generate_speech_auto, CHANNEL_VOICES
from core_engine.portrait_animator import stream_frames_to_pipe

logger = logging.getLogger("nur.composer")

WIDTH, HEIGHT = 1920, 1080
FPS = 30

CHANNEL_SCRIPTS: dict[str, dict] = {
    "nur-global": {
        "name": "NUR Finance Global",
        "host": "Victoria Ashworth",
        "host_id": "host-victoria",
        "script": (
            "Good morning, this is NUR Finance Global broadcasting live from London. "
            "European markets are opening higher this morning. The FTSE 100 is up zero point eight percent "
            "at eight thousand two hundred and thirty four. Mining stocks are leading the gains on a copper rally. "
            "The European Central Bank held rates steady at three point seven five percent yesterday, "
            "signaling a possible December cut. The euro is trading at one point zero eight nine two against the dollar. "
            "Gold is up one point two percent at twenty four eighteen per ounce on safe-haven demand. "
            "Brent crude is slightly higher at eighty two dollars and forty cents. "
            "Looking ahead, we have US non-farm payrolls data due on Friday, which could set the tone for the week. "
            "Stay with NUR Finance for full coverage throughout the day."
        ),
    },
    "nur-usa": {
        "name": "NUR Finance US",
        "host": "Sarah Mitchell",
        "host_id": "host-sarah",
        "script": (
            "Good morning from New York, this is NUR Finance US. "
            "Wall Street is set to open higher today. S&P 500 futures are up zero point four percent. "
            "Nvidia beat earnings expectations, sending tech stocks higher in pre-market trading. "
            "The Nasdaq is looking at a strong open. "
            "The Federal Reserve minutes showed most members favor holding rates steady for now. "
            "US ten-year yield is down six basis points at four point two two percent. "
            "Bitcoin is trading above sixty seven thousand dollars with ETF inflows hitting a new daily record. "
            "This is NUR Finance US, stay with us for Wall Street Morning."
        ),
    },
    "nur-turkey": {
        "name": "NUR Finans Türkiye",
        "host": "Defne Karataş",
        "host_id": "host-defne",
        "script": (
            "Günaydın, NUR Finans Türkiye'den canlı yayınla İstanbul'dan bildiriyoruz. "
            "BIST 100 endeksi bugün yüzde sıfır nokta altı artışla dokuz bin üç yüz seviyelerinde işlem görüyor. "
            "Merkez Bankası politika faizini yüzde elli'de sabit tuttu. Döviz piyasalarında dolar TL yirmi üç lira "
            "altmış kuruş seviyesinde. Euro TL yirmi altı lira on kuruştan işlem görüyor. "
            "Altın ons fiyatı iki bin dört yüz on sekiz dolar ile rekor seviyeye yakın. "
            "Gram altın iki bin bir yüz elli lira. Borsa İstanbul'da bankacılık sektörü yüzde bir buçuk değer kazandı. "
            "NUR Finans Türkiye ile günün tüm gelişmelerini takip edin."
        ),
    },
    "nur-arabic": {
        "name": "نور المالية",
        "host": "Fatima Al-Qahtani",
        "host_id": "host-fatima",
        "script": (
            "صباح الخير من دبي، هنا نور المالية. "
            "الأسواق الخليجية تفتتح تداولاتها اليوم على ارتفاع. "
            "مؤشر سوق دبي المالي يرتفع بنسبة واحد بالمئة. "
            "أسعار النفط برنت تتداول عند اثنين وثمانين دولاراً للبرميل. "
            "الذهب يواصل ارتفاعه متجاوزاً ألفين وأربعمئة دولار للأونصة. "
            "البنك المركزي الأوروبي أبقى على أسعار الفائدة دون تغيير. "
            "ابقوا معنا على نور المالية لمتابعة آخر التطورات."
        ),
    },
    "nur-deutsch": {
        "name": "NUR Finanzen",
        "host": "Katharina Vogt",
        "host_id": "host-katharina",
        "script": (
            "Guten Morgen aus Frankfurt, hier ist NUR Finanzen. "
            "Der DAX eröffnet heute im Plus bei achtzehn tausend achthundertneunzig Punkten. "
            "SAP erreicht ein neues Allzeithoch, getrieben durch die starke Nachfrage nach KI-Lösungen. "
            "Die EZB hat die Leitzinsen unverändert bei drei Komma fünfundsiebzig Prozent belassen. "
            "Der Euro notiert bei eins Komma null acht neun zwei gegenüber dem Dollar. "
            "Der Ifo Geschäftsklimaindex liegt bei siebenundachtzig Komma zwei und übertrifft die Erwartungen. "
            "Bleiben Sie dran bei NUR Finanzen für alle Marktentwicklungen."
        ),
    },
    "nur-france": {
        "name": "NUR Finance France",
        "host": "Éloïse Dupont",
        "host_id": "host-eloise",
        "script": (
            "Bonjour de Paris, ici NUR Finance France. "
            "Le CAC 40 ouvre en hausse ce matin, porté par le secteur du luxe. "
            "LVMH et Hermès affichent des gains supérieurs à un pour cent. "
            "La BCE a maintenu ses taux directeurs inchangés à trois virgule soixante-quinze pour cent. "
            "L'euro se négocie à un virgule zéro huit neuf deux face au dollar. "
            "Le pétrole Brent est en légère hausse à quatre-vingt-deux dollars le baril. "
            "Restez avec NUR Finance France pour suivre l'actualité des marchés."
        ),
    },
    "nur-japan": {
        "name": "NURファイナンス・ジャパン",
        "host": "美咲 田中",
        "host_id": "host-misaki",
        "script": (
            "おはようございます。NURファイナンス・ジャパンです。東京からお届けします。"
            "日経平均株価は本日、三万八千四百二十円で取引されています。"
            "日本銀行が利上げを示唆し、円がドルに対して一時百四十八円台まで急騰しました。"
            "半導体関連株が堅調で、東京エレクトロンが三パーセント上昇しています。"
            "アジア市場全体では、上海総合指数も小幅高となっています。"
            "NURファイナンスで最新のマーケット情報をお届けします。"
        ),
    },
    "nur-china": {
        "name": "光辉金融",
        "host": "明玉 李",
        "host_id": "host-mingyu",
        "script": (
            "早上好，这里是光辉金融，从上海为您报道。"
            "上证综指今日开盘上涨零点三个百分点。"
            "中国人民银行下调一年期中期借贷便利利率十五个基点至二点三五。"
            "科创板表现强劲，半导体板块领涨。"
            "人民币兑美元汇率在七点一八附近波动。"
            "黄金价格突破每盎司两千四百美元。"
            "请继续关注光辉金融，获取最新市场动态。"
        ),
    },
    "nur-korea": {
        "name": "NUR 파이낸스 코리아",
        "host": "소연 김",
        "host_id": "host-soyeon",
        "script": (
            "안녕하세요, NUR 파이낸스 코리아입니다. 서울에서 전해드립니다. "
            "코스피 지수가 오늘 이천칠백구십 포인트에서 거래되고 있습니다. "
            "삼성전자와 SK하이닉스가 반도체 호황에 힘입어 상승세를 보이고 있습니다. "
            "원달러 환율은 천삼백이십원 수준입니다. "
            "한국은행은 기준금리를 삼점오퍼센트로 동결했습니다. "
            "NUR 파이낸스와 함께 시장 동향을 확인하세요."
        ),
    },
    "nur-india": {
        "name": "NUR Finance India",
        "host": "Ananya Sharma",
        "host_id": "host-ananya",
        "script": (
            "नमस्ते, NUR फाइनेंस इंडिया में आपका स्वागत है। मुंबई से लाइव। "
            "सेंसेक्स आज शुरुआती कारोबार में अस्सी हजार अंक के पार पहुंच गया है। "
            "निफ्टी पचीस हजार तीन सौ के स्तर पर कारोबार कर रहा है। "
            "बैंकिंग सेक्टर में तेजी जारी है। "
            "रिजर्व बैंक ने रेपो रेट को साढ़े छह प्रतिशत पर बनाए रखा है। "
            "सोने का भाव बहत्तर हजार रुपये प्रति दस ग्राम के करीब है। "
            "NUR फाइनेंस इंडिया के साथ बाजार की हर खबर पाइए।"
        ),
    },
    "nur-brazil": {
        "name": "NUR Finanças Brasil",
        "host": "Isabella Santos",
        "host_id": "host-isabella",
        "script": (
            "Bom dia, aqui é a NUR Finanças Brasil, ao vivo de São Paulo. "
            "O Ibovespa abre em alta nesta manhã, impulsionado pelo setor de commodities. "
            "A Vale sobe dois por cento com a alta do minério de ferro. "
            "A Petrobras também registra ganhos com o petróleo acima de oitenta dólares. "
            "O dólar comercial está cotado a cinco reais e doze centavos. "
            "A taxa Selic permanece em dez vírgula cinco por cento ao ano. "
            "Fique com a NUR Finanças Brasil para todas as atualizações do mercado."
        ),
    },
    "nur-latam": {
        "name": "NUR Finanzas",
        "host": "Valentina Reyes",
        "host_id": "host-valentina",
        "script": (
            "Buenos días desde Ciudad de México, aquí NUR Finanzas. "
            "Los mercados latinoamericanos abren al alza esta mañana. "
            "El IPC mexicano sube cero punto seis por ciento. "
            "El peso mexicano se mantiene estable frente al dólar en diecisiete pesos. "
            "El Banco de México mantiene la tasa de referencia en once punto veinticinco por ciento. "
            "El petróleo WTI cotiza en setenta y ocho dólares por barril. "
            "Siga con NUR Finanzas para toda la cobertura de mercados."
        ),
    },
}


def _draw_studio_background(img: Image.Image, draw: ImageDraw.Draw, bc: tuple) -> None:
    """Draw a realistic broadcast studio / office environment."""
    import math

    # Base: dark professional studio
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(12 + ratio * 8)
        g = int(18 + ratio * 12)
        b = int(32 + ratio * 15)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

    # Back wall panels (office feel)
    wall_color = (18, 28, 45)
    panel_border = (30, 42, 60)
    for px in range(3):
        x0 = 50 + px * 320
        draw.rectangle([(x0, 40), (x0 + 280, 480)], fill=wall_color, outline=panel_border, width=1)

    # Left monitor — chart display
    mon_x, mon_y = 60, 60
    draw.rectangle([(mon_x, mon_y), (mon_x + 260, mon_y + 380)], fill=(8, 14, 25))
    draw.rectangle([(mon_x, mon_y), (mon_x + 260, mon_y + 28)], fill=bc)
    draw.rectangle([(mon_x + 2, mon_y + 2), (mon_x + 258, mon_y + 26)], fill=bc)

    # Chart on left monitor
    chart_y_base = mon_y + 200
    points = []
    for i in range(26):
        cx = mon_x + 10 + i * 10
        cy = chart_y_base - int(math.sin(i * 0.4) * 40 + math.cos(i * 0.2) * 25 + i * 3)
        points.append((cx, cy))
    if len(points) > 1:
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=bc, width=2)
    # Fill under chart
    if points:
        fill_pts = points + [(points[-1][0], chart_y_base + 60), (points[0][0], chart_y_base + 60)]
        draw.polygon(fill_pts, fill=(bc[0], bc[1], bc[2], 30) if len(bc) >= 3 else (0, 200, 160, 30))
    # Grid lines
    for gy in range(5):
        gy_pos = mon_y + 50 + gy * 70
        draw.line([(mon_x + 10, gy_pos), (mon_x + 250, gy_pos)], fill=(40, 55, 75), width=1)

    # Right monitor — world map dots
    rmon_x = 690
    draw.rectangle([(rmon_x, mon_y), (rmon_x + 260, mon_y + 380)], fill=(8, 14, 25))
    draw.rectangle([(rmon_x, mon_y), (rmon_x + 260, mon_y + 28)], fill=(40, 55, 75))
    map_dots = [(730, 180), (770, 220), (810, 160), (850, 250), (890, 170), (870, 300), (760, 300), (820, 330)]
    for dx, dy in map_dots:
        draw.ellipse([dx - 4, dy - 4, dx + 4, dy + 4], fill=bc)
        draw.ellipse([dx - 8, dy - 8, dx + 8, dy + 8], outline=(bc[0], bc[1], bc[2], 80))

    # Desk surface
    desk_y = 530
    desk_grad_top = (25, 35, 50)
    desk_grad_bot = (15, 22, 35)
    draw.rectangle([(0, desk_y), (WIDTH, desk_y + 8)], fill=bc)
    for dy in range(desk_y + 8, HEIGHT):
        ratio = (dy - desk_y - 8) / (HEIGHT - desk_y - 8)
        r = int(desk_grad_top[0] + (desk_grad_bot[0] - desk_grad_top[0]) * ratio)
        g = int(desk_grad_top[1] + (desk_grad_bot[1] - desk_grad_top[1]) * ratio)
        b = int(desk_grad_top[2] + (desk_grad_bot[2] - desk_grad_top[2]) * ratio)
        draw.line([(0, dy), (WIDTH, dy)], fill=(r, g, b))

    # Desk items: laptop, papers
    draw.polygon([(100, desk_y + 20), (130, desk_y + 12), (260, desk_y + 12), (280, desk_y + 20)],
                 fill=(40, 40, 45))
    draw.rectangle([(135, desk_y + 14), (255, desk_y + 18)], fill=(60, 70, 85))

    # Ambient lighting effects
    for lx, ly, radius in [(WIDTH // 2, 30, 400), (100, 100, 200), (WIDTH - 100, 100, 200)]:
        for ring in range(radius, 0, -10):
            alpha = max(0, int(6 * (1 - ring / radius)))
            if alpha > 0:
                draw.ellipse([lx - ring, ly - ring, lx + ring, ly + ring],
                             fill=(bc[0], bc[1], bc[2], alpha))


def create_broadcast_frame(
    channel_name: str,
    host_name: str,
    host_id: str = "",
    headline: str = "MARKETS UPDATE",
    ticker_text: str = "",
    brand_color: str = "#00d4aa",
    portrait_dir: str = "public/assets/characters",
) -> Image.Image:
    """Studio background + presenter portrait only. UI overlays are handled by LiveBroadcast.tsx."""
    img = Image.new("RGBA", (WIDTH, HEIGHT), color=(10, 22, 40, 255))
    draw = ImageDraw.Draw(img, "RGBA")

    bc = tuple(int(brand_color.lstrip("#")[i:i+2], 16) for i in (0, 2, 4))

    _draw_studio_background(img, draw, bc)

    portrait_path = os.path.join(portrait_dir, f"{host_id}.png")
    if host_id and os.path.exists(portrait_path):
        portrait = Image.open(portrait_path).convert("RGBA")
        portrait = portrait.resize((480, 480), Image.LANCZOS)
        paste_x = (WIDTH - 480) // 2
        paste_y = 140
        img.paste(portrait, (paste_x, paste_y), portrait)

    return img.convert("RGB")


def compose_video(
    channel_id: str,
    output_dir: str = "output/daily_summaries",
) -> str | None:
    if channel_id not in CHANNEL_SCRIPTS:
        logger.warning("No script for channel: %s", channel_id)
        return None

    config = CHANNEL_SCRIPTS[channel_id]
    os.makedirs(output_dir, exist_ok=True)

    audio_path = os.path.join(output_dir, f"{channel_id}.mp3")
    frame_path = os.path.join(output_dir, f"{channel_id}_frame.png")
    video_path = os.path.join(output_dir, f"{channel_id}.mp4")
    meta_path = os.path.join(output_dir, f"{channel_id}.json")

    # 1. Generate TTS audio
    logger.info("Generating TTS for %s...", channel_id)
    generate_speech_auto(
        text=config["script"],
        output_path=audio_path,
        host_id=config["host_id"],
    )

    if not os.path.exists(audio_path):
        logger.error("TTS failed for %s", channel_id)
        return None

    # 2. Create animated broadcast frames
    logger.info("Creating animated frames for %s...", channel_id)
    brand_colors = {
        "nur-global": "#00d4aa", "nur-usa": "#3b82f6", "nur-turkey": "#e30a17",
        "nur-arabic": "#e8a838", "nur-deutsch": "#ffcc00", "nur-france": "#0055a4",
        "nur-japan": "#bc002d", "nur-china": "#de2910", "nur-korea": "#003478",
        "nur-india": "#ff9933", "nur-brazil": "#009c3b", "nur-latam": "#006847",
    }

    # Get audio duration to determine frame count
    duration_cmd = ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                    "-of", "default=noprint_wrappers=1:nokey=1", audio_path]
    dur_result = subprocess.run(duration_cmd, capture_output=True, text=True)
    audio_duration = float(dur_result.stdout.strip()) if dur_result.returncode == 0 else 60.0
    total_frames = int(audio_duration * FPS) + FPS

    # Create static background (once)
    bg = create_broadcast_frame(
        channel_name=config["name"],
        host_name=config["host"],
        host_id="",
        brand_color=brand_colors.get(channel_id, "#00d4aa"),
    )

    portrait_path = os.path.join("public/assets/characters", f"{config['host_id']}.png")
    paste_x = (WIDTH - 480) // 2
    paste_y = 140

    # 3. Compose video: stream animated frames + audio → MP4
    logger.info("Composing video for %s (%d frames)...", channel_id, total_frames)
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS),
        "-i", "pipe:0",
        "-i", audio_path,
        "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        video_path,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

    if os.path.exists(portrait_path):
        stream_frames_to_pipe(
            background=bg, portrait_path=portrait_path,
            paste_x=paste_x, paste_y=paste_y,
            total_frames=total_frames, pipe=proc.stdin, fps=FPS,
        )
    else:
        static_bytes = bg.convert("RGB").tobytes()
        for _ in range(total_frames):
            try:
                proc.stdin.write(static_bytes)
            except BrokenPipeError:
                break

    try:
        proc.stdin.close()
    except (BrokenPipeError, OSError):
        pass
    proc.wait()

    if proc.returncode != 0:
        logger.error("ffmpeg failed for %s: %s", channel_id, proc.stderr.read().decode()[-500:])
        return None

    # 4. Write metadata
    size_kb = os.path.getsize(video_path) / 1024
    meta = {
        "channel_id": channel_id,
        "channel_name": config["name"],
        "host": config["host"],
        "host_id": config["host_id"],
        "voice": CHANNEL_VOICES[channel_id].voice_id if channel_id in CHANNEL_VOICES else "unknown",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "video_path": video_path,
        "size_kb": round(size_kb, 1),
        "resolution": f"{WIDTH}x{HEIGHT}",
        "fps": FPS,
    }
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)

    logger.info("✓ %s: %s (%.1f KB)", channel_id, video_path, size_kb)
    return video_path


def compose_all(output_dir: str = "output/daily_summaries") -> dict[str, str | None]:
    results = {}
    for channel_id in CHANNEL_SCRIPTS:
        try:
            results[channel_id] = compose_video(channel_id, output_dir)
        except Exception as e:
            logger.error("Failed %s: %s", channel_id, e)
            results[channel_id] = None
    return results


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(message)s")
    results = compose_all()
    print("\n=== Results ===")
    for ch, path in results.items():
        status = f"✓ {path}" if path else "✗ FAILED"
        print(f"  {ch}: {status}")
