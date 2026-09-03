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
import subprocess
import logging
from datetime import datetime, timezone
from PIL import Image, ImageDraw, ImageFont

from core_engine.tts_engine import generate_speech_espeak, CHANNEL_VOICES

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


def create_broadcast_frame(
    channel_name: str,
    host_name: str,
    headline: str = "MARKETS UPDATE",
    ticker_text: str = "",
    brand_color: str = "#00d4aa",
) -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), color="#0a1628")
    draw = ImageDraw.Draw(img)

    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 42)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        font_ticker = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
        font_tiny = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except OSError:
        font_large = ImageFont.load_default()
        font_medium = font_large
        font_small = font_large
        font_ticker = font_large
        font_tiny = font_large

    # Studio background gradient effect
    for y in range(HEIGHT):
        r = int(10 + (y / HEIGHT) * 5)
        g = int(22 + (y / HEIGHT) * 8)
        b = int(40 + (y / HEIGHT) * -10)
        draw.line([(0, y), (WIDTH, y)], fill=(max(0, r), max(0, g), max(0, b)))

    # NUR FINANCE logo top-left
    bc = tuple(int(brand_color.lstrip("#")[i:i+2], 16) for i in (0, 2, 4))
    draw.text((40, 30), "NUR", fill=bc, font=font_large)
    draw.text((150, 42), "FINANCE", fill=(255, 255, 255, 180), font=font_small)

    # LIVE badge
    draw.rectangle([(310, 32), (400, 62)], fill=(239, 68, 68))
    draw.text((322, 35), "● LIVE", fill=(255, 255, 255), font=font_small)

    # Channel name
    draw.text((40, 80), channel_name, fill=(255, 255, 255, 200), font=font_medium)

    # Clock (UTC)
    now = datetime.now(timezone.utc)
    time_str = now.strftime("%H:%M UTC")
    draw.text((WIDTH - 200, 35), time_str, fill=(255, 255, 255, 150), font=font_medium)

    # Center area — headline
    draw.text((WIDTH // 2 - 150, HEIGHT // 2 - 80), headline, fill=(255, 255, 255), font=font_large)

    # Market data panel (right side)
    panel_x = WIDTH - 320
    panel_y = 140
    draw.rectangle([(panel_x, panel_y), (WIDTH - 20, panel_y + 450)], fill=(10, 20, 35, 200))
    draw.rectangle([(panel_x, panel_y), (WIDTH - 20, panel_y + 35)], fill=bc)
    draw.text((panel_x + 15, panel_y + 5), "MARKETS", fill=(255, 255, 255), font=font_small)

    markets = [
        ("FTSE 100", "8,234", "+0.82%", True),
        ("S&P 500", "5,567", "+0.41%", True),
        ("NASDAQ", "17,890", "+0.63%", True),
        ("DAX", "18,890", "+0.52%", True),
        ("EUR/USD", "1.0892", "+0.28%", True),
        ("Gold", "$2,418", "+1.22%", True),
        ("Brent", "$82.40", "+0.58%", True),
        ("Bitcoin", "$67,420", "+2.84%", True),
        ("Nikkei", "38,420", "-1.38%", False),
        ("VIX", "14.20", "-3.40%", False),
    ]
    for i, (sym, price, chg, up) in enumerate(markets):
        y = panel_y + 45 + i * 40
        draw.text((panel_x + 15, y), sym, fill=(255, 255, 255, 200), font=font_tiny)
        draw.text((panel_x + 120, y), price, fill=(255, 255, 255, 150), font=font_tiny)
        color = (0, 212, 170) if up else (239, 68, 68)
        draw.text((panel_x + 220, y), chg, fill=color, font=font_tiny)

    # Lower third
    lt_y = HEIGHT - 160
    draw.rectangle([(0, lt_y), (500, lt_y + 50)], fill=bc)
    draw.text((20, lt_y + 10), host_name, fill=(255, 255, 255), font=font_medium)
    draw.rectangle([(0, lt_y + 50), (700, lt_y + 85)], fill=(0, 0, 0, 180))
    draw.text((20, lt_y + 55), channel_name, fill=(255, 255, 255, 200), font=font_small)

    # Breaking news banner
    bn_y = HEIGHT - 70
    draw.rectangle([(0, bn_y), (WIDTH, bn_y + 32)], fill=(185, 28, 28))
    draw.rectangle([(0, bn_y), (120, bn_y + 32)], fill=(255, 255, 255))
    draw.text((12, bn_y + 5), "BREAKING", fill=(185, 28, 28), font=font_small)
    ticker = ticker_text or "ECB holds rates at 3.75% · FTSE 100 hits intraday high · Gold rallies to $2,418"
    draw.text((135, bn_y + 5), ticker, fill=(255, 255, 255), font=font_small)

    # Bottom ticker bar
    draw.rectangle([(0, HEIGHT - 36), (WIDTH, HEIGHT)], fill=(0, 8, 20))
    draw.rectangle([(0, HEIGHT - 36), (160, HEIGHT)], fill=bc)
    draw.text((12, HEIGHT - 32), "NUR FINANCE", fill=(255, 255, 255), font=font_tiny)
    draw.text((175, HEIGHT - 32), "◆ Markets update · Stay tuned for full coverage", fill=(255, 255, 255, 200), font=font_tiny)

    return img


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
    generate_speech_espeak(
        text=config["script"],
        output_path=audio_path,
        host_id=config["host_id"],
    )

    if not os.path.exists(audio_path):
        logger.error("TTS failed for %s", channel_id)
        return None

    # 2. Create broadcast frame
    logger.info("Creating broadcast frame for %s...", channel_id)
    brand_colors = {
        "nur-global": "#00d4aa", "nur-usa": "#3b82f6", "nur-turkey": "#e30a17",
        "nur-arabic": "#e8a838", "nur-deutsch": "#ffcc00", "nur-france": "#0055a4",
        "nur-japan": "#bc002d", "nur-china": "#de2910", "nur-korea": "#003478",
        "nur-india": "#ff9933", "nur-brazil": "#009c3b", "nur-latam": "#006847",
    }
    frame = create_broadcast_frame(
        channel_name=config["name"],
        host_name=config["host"],
        brand_color=brand_colors.get(channel_id, "#00d4aa"),
    )
    frame.save(frame_path, "PNG")

    # 3. Compose video: static frame + audio → MP4
    logger.info("Composing video for %s...", channel_id)
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", frame_path,
        "-i", audio_path,
        "-c:v", "libx264", "-preset", "ultrafast", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "128k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        "-r", str(FPS),
        video_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        logger.error("ffmpeg failed for %s: %s", channel_id, result.stderr[-500:])
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
