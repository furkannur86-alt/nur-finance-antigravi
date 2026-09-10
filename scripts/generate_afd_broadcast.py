"""
NUR Finance — AFD Broadcast Generator
Üretir: 3 dilli MP4 video (DE, EN, TR)
Konu: Almanya'da AFD seçimi — NUR Finance finansal eleştirisi
"""

import asyncio
import os
import subprocess
import tempfile
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ── Çıktı klasörü ──────────────────────────────────────────────────
OUT_DIR = Path("output/afd_broadcast")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Broadcast script'leri ───────────────────────────────────────────
BROADCASTS = [
    {
        "id": "nur-deutsch-afd",
        "lang": "de",
        "voice": "de-DE-KatjaNeural",
        "host": "Katharina Weiss",
        "channel": "NUR FINANCE DEUTSCHLAND",
        "title": "AFD-WAHL: FINANZMARKT-ANALYSE",
        "script": (
            "Guten Abend. Hier ist NUR Finance Deutschland. "
            "Die AfD hat bei der Bundestagswahl ein historisches Ergebnis erzielt — "
            "und die Finanzmärkte reagieren mit deutlicher Nervosität. "
            "Der DAX verlor in den ersten Handelsstunden nach Bekanntgabe der Ergebnisse bis zu anderthalb Prozent. "
            "Der Euro fiel gegenüber dem Dollar auf den niedrigsten Stand seit drei Monaten. "
            "NUR Finance bewertet das Ergebnis als erhebliches Risiko für die deutsche Wirtschaft. "
            "Erstens: Die AfD lehnt die europäische Integration ab. "
            "Ein Rückzug aus dem Euro oder eine Schwächung der EZB-Unabhängigkeit "
            "würde die deutschen Exportindustrien, allen voran Automobil und Maschinenbau, massiv schädigen. "
            "Zweitens: Die vorgeschlagene Migrationsbeschränkung "
            "verschärft den ohnehin kritischen Fachkräftemangel. "
            "Deutschland braucht laut Bundesagentur für Arbeit mindestens vierhunderttausend Zuwanderer jährlich, "
            "um das Wachstum zu stabilisieren. "
            "Drittens: Energiepolitik. Die AfD will aus den erneuerbaren Energien aussteigen "
            "und Kohle und Gas verlängern. "
            "Das würde deutschen Unternehmen langfristige CO2-Strafzahlungen auferlegen "
            "und den Industriestandort schwächen. "
            "NUR Finance Prognose: Bei einer AfD-geführten Koalition "
            "erwarten wir eine Ausweitung der deutschen Risikoprämie, "
            "eine Abschwächung des DAX um fünf bis zwölf Prozent innerhalb eines Jahres, "
            "und möglicherweise eine Herabstufung der deutschen Kreditwürdigkeit durch Ratingagenturen. "
            "Anleger sollten deutsche Staatsanleihen untergewichten "
            "und Positionen in der Schweiz und Skandinavien aufbauen. "
            "Das war NUR Finance Deutschland. Bleiben Sie informiert."
        ),
        "color_accent": (220, 50, 50),
        "color_bg": (8, 12, 22),
        "color_channel": (220, 50, 50),
        "flag": "🇩🇪",
    },
    {
        "id": "nur-global-afd",
        "lang": "en",
        "voice": "en-GB-SoniaNeural",
        "host": "Victoria Ashworth",
        "channel": "NUR FINANCE GLOBAL",
        "title": "AFD ELECTION: MARKET IMPACT ANALYSIS",
        "script": (
            "Good evening. This is NUR Finance Global, broadcasting from London. "
            "Germany's far-right AfD party has achieved its strongest election result since World War Two, "
            "and global markets are watching closely. "
            "The euro slipped against the dollar, and German bund yields ticked higher "
            "as risk premiums on European sovereign debt began to widen. "
            "From a pure financial perspective, this is a significant negative event. "
            "Germany is the largest economy in the Eurozone, accounting for roughly twenty-eight percent of EU GDP. "
            "Political instability in Berlin sends shockwaves through Brussels and beyond. "
            "The AfD's core economic positions create three major risk vectors for investors. "
            "Number one: Euro exit risk. While an immediate Dexit is unlikely, "
            "even the rhetoric destabilises the common currency. "
            "Our models suggest that sustained AfD influence could widen "
            "the France-Germany bond spread by thirty to fifty basis points. "
            "Number two: Trade and tariff exposure. "
            "Germany's export-driven economy — Volkswagen, Siemens, BASF — "
            "is deeply dependent on open European and global trade. "
            "Nationalist protectionism is structurally negative for these companies. "
            "Number three: Green transition reversal. "
            "Germany's industrial base has committed hundreds of billions to decarbonisation. "
            "Reversing course now would create stranded asset risk across the energy and automotive sectors. "
            "NUR Finance recommendation: reduce exposure to DAX exporters, "
            "rotate into Swiss franc-denominated assets, "
            "and monitor ECB policy signals closely. "
            "The political risk premium on German assets just rose materially. "
            "This is Victoria Ashworth, NUR Finance Global. Stay ahead."
        ),
        "color_accent": (0, 212, 170),
        "color_bg": (8, 12, 22),
        "color_channel": (0, 212, 170),
        "flag": "🌍",
    },
    {
        "id": "nur-turkey-afd",
        "lang": "tr",
        "voice": "tr-TR-EmelNeural",
        "host": "Defne Yıldız",
        "channel": "NUR FINANCE TÜRKİYE",
        "title": "AFD SEÇİM SONUÇLARI: FİNANS ANALİZİ",
        "script": (
            "İyi akşamlar. NUR Finance Türkiye yayınındayız. "
            "Almanya'da AfD, tarihinin en yüksek oy oranını aldı "
            "ve bu sonuç, sadece Avrupa'yı değil küresel piyasaları da derinden sarstı. "
            "Peki bu Türkiye için ne anlama geliyor? "
            "Birincisi, döviz riski. "
            "Euro, AfD'nin yükselişiyle birlikte dolar karşısında değer kaybetti. "
            "Türkiye'nin Almanya ile ikili ticaret hacmi yılda seksen milyar Euro'nun üzerinde. "
            "Euro'daki her yüzde bir değer kaybı, Türk ihracat gelirlerini olumsuz etkiler. "
            "İkincisi, işçi dövizleri. "
            "Almanya'da yaklaşık üç buçuk milyon Türk kökenli vatandaş yaşıyor. "
            "AfD'nin yabancı düşmanı politikaları, "
            "bu topluluğu ekonomik ve sosyal baskıyla karşı karşıya bırakabilir. "
            "Türkiye'ye gönderilen işçi dövizleri risk altında olabilir. "
            "Üçüncüsü, Türk ihracatı. "
            "Almanya, Türkiye'nin en büyük ihracat pazarlarından biri. "
            "AfD hükümetinin korumacı politikaları, "
            "Türk tekstil, otomotiv parçaları ve gıda ürünlerine ek engeller getirebilir. "
            "NUR Finance değerlendirmesi: "
            "AfD iktidarı, Türk yatırımcılar için Almanya merkezli varlıklarda risk artışı anlamına geliyor. "
            "Euro cinsinden portföylerde savunmacı pozisyon alınmasını tavsiye ediyoruz. "
            "İsviçre Frangı ve Norveç Kronu gibi kuzey Avrupa sığınma varlıkları öne çıkıyor. "
            "Bu haber NUR Finance Türkiye'den. Güncel kalın."
        ),
        "color_accent": (220, 50, 50),
        "color_bg": (8, 12, 22),
        "color_channel": (220, 50, 50),
        "flag": "🇹🇷",
    },
]

# ── Görsel üretici ──────────────────────────────────────────────────
WIDTH, HEIGHT = 1280, 720  # telefon için daha kompakt

def make_frame(broadcast: dict) -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), broadcast["color_bg"])
    draw = ImageDraw.Draw(img)
    accent = broadcast["color_accent"]
    muted = (80, 100, 120)
    white = (220, 230, 240)

    # ── Arka plan grid ──
    for x in range(0, WIDTH, 60):
        draw.line([(x, 0), (x, HEIGHT)], fill=(15, 22, 35), width=1)
    for y in range(0, HEIGHT, 60):
        draw.line([(0, y), (WIDTH, y)], fill=(15, 22, 35), width=1)

    # ── Üst banner ──
    draw.rectangle([(0, 0), (WIDTH, 56)], fill=(0, 0, 0))
    draw.rectangle([(0, 52), (WIDTH, 56)], fill=accent)

    # ── Kanal adı ──
    try:
        font_channel = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
        font_title = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 30)
        font_host = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 18)
        font_ticker = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 14)
        font_small = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 14)
    except Exception:
        font_channel = font_title = font_host = font_ticker = font_small = ImageFont.load_default()

    draw.text((16, 16), broadcast["channel"], font=font_channel, fill=accent)

    # ── CANLI badge ──
    draw.ellipse([(WIDTH - 90, 18), (WIDTH - 76, 32)], fill=(220, 30, 30))
    draw.text((WIDTH - 72, 16), "CANLI", font=font_small, fill=(220, 30, 30))

    # ── Başlık metni (ortalanmış) ──
    title = broadcast["title"]
    bbox = draw.textbbox((0, 0), title, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, 90), title, font=font_title, fill=white)

    # ── Accent çizgisi başlığın altında ──
    draw.rectangle([((WIDTH - tw) // 2, 128), ((WIDTH + tw) // 2, 131)], fill=accent)

    # ── Host portre alanı (sol) ──
    portrait_path = f"public/assets/characters/host-{broadcast['host'].split()[0].lower()}.png"
    if os.path.exists(portrait_path):
        try:
            portrait = Image.open(portrait_path).convert("RGBA")
            ph = 340
            pw = int(portrait.width * ph / portrait.height)
            portrait = portrait.resize((pw, ph), Image.LANCZOS)
            # dairesel kırp
            mask = Image.new("L", (pw, ph), 0)
            md = ImageDraw.Draw(mask)
            md.ellipse([(0, 0), (pw, ph)], fill=255)
            portrait_rgb = Image.new("RGB", (pw, ph), broadcast["color_bg"])
            portrait_rgb.paste(portrait, mask=portrait.split()[3] if portrait.mode == "RGBA" else mask)
            px, py = 80, 160
            img.paste(portrait_rgb, (px, py), mask)
        except Exception:
            # Portré yoksa placeholder daire
            draw.ellipse([(80, 160), (300, 500)], outline=accent, width=2, fill=(20, 30, 45))
    else:
        draw.ellipse([(80, 160), (300, 500)], outline=accent, width=2, fill=(20, 30, 45))
        draw.text((130, 310), broadcast["flag"], font=font_title, fill=white)

    # ── Host adı ve unvanı ──
    draw.text((90, 515), broadcast["host"], font=font_host, fill=white)
    draw.text((90, 538), "Baş Ekonomi Editörü · NUR Finance", font=font_small, fill=muted)

    # ── Sağ panel — Finansal veri kartları ──
    cards = [
        ("DAX 40", "▼ -2.3%", (220, 50, 50)),
        ("EUR/USD", "▼ 1.0712", (220, 100, 50)),
        ("BUND 10Y", "▲ 2.91%", (50, 180, 100)),
        ("CDS Almanya", "▲ +18 bp", (220, 150, 50)),
        ("AfD Risk Skoru", "★ YÜKSEK", (220, 50, 50)),
    ]
    cx = 580
    for i, (label, value, color) in enumerate(cards):
        cy = 150 + i * 88
        draw.rectangle([(cx, cy), (cx + 320, cy + 72)], fill=(14, 22, 36), outline=(30, 45, 65), width=1)
        draw.text((cx + 14, cy + 10), label, font=font_small, fill=muted)
        draw.text((cx + 14, cy + 32), value, font=font_host, fill=color)
        draw.rectangle([(cx, cy), (cx + 4, cy + 72)], fill=color)

    # ── NUR Finance watermark ──
    draw.text((WIDTH - 150, HEIGHT - 28), "NUR FINANCE", font=font_small, fill=muted)

    # ── Alt ticker bar ──
    draw.rectangle([(0, HEIGHT - 40), (WIDTH, HEIGHT)], fill=(0, 0, 0))
    draw.rectangle([(0, HEIGHT - 40), (WIDTH, HEIGHT - 38)], fill=accent)
    ticker_text = "  NUR FINANCE  |  DAX ▼2.3%  |  EUR/USD 1.0712  |  AFD RİSK SKORU: YÜKSEK  |  DAX 10Y PROJEKSİYON: -%8  |  ALTIN ▲1.4%  |  CHF GÜÇLÜ  "
    draw.text((10, HEIGHT - 28), ticker_text, font=font_ticker, fill=white)

    return img


# ── TTS üretici ────────────────────────────────────────────────────
async def generate_tts(script: str, voice: str, out_path: str) -> bool:
    try:
        import edge_tts
        communicate = edge_tts.Communicate(script, voice, rate="+5%", volume="+0%")
        await communicate.save(out_path)
        return os.path.exists(out_path) and os.path.getsize(out_path) > 1000
    except Exception as e:
        print(f"TTS hatası: {e}")
        return False


# ── Video birleştirici ─────────────────────────────────────────────
def compose_video(frame_path: str, audio_path: str, out_path: str, duration_s: float) -> bool:
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", frame_path,
        "-i", audio_path,
        "-c:v", "libx264", "-preset", "fast", "-crf", "22",
        "-c:a", "aac", "-b:a", "128k",
        "-shortest",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",  # telefonda hızlı başlatma
        out_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    return result.returncode == 0 and os.path.exists(out_path)


# ── Ana üretim döngüsü ─────────────────────────────────────────────
async def main():
    print("=" * 60)
    print("  NUR Finance — AFD Broadcast Üretimi")
    print("=" * 60)

    produced = []

    for bc in BROADCASTS:
        print(f"\n[{bc['id']}] Başlıyor — {bc['channel']}")

        with tempfile.TemporaryDirectory() as tmp:
            frame_path = os.path.join(tmp, "frame.jpg")
            audio_path = os.path.join(tmp, "audio.mp3")
            out_path = str(OUT_DIR / f"{bc['id']}.mp4")

            # 1. Görsel kare
            print("  → Görsel üretiliyor...")
            frame = make_frame(bc)
            frame.save(frame_path, "JPEG", quality=92)

            # 2. TTS ses
            print(f"  → Ses üretiliyor ({bc['voice']})...")
            ok = await generate_tts(bc["script"], bc["voice"], audio_path)
            if not ok:
                print("  ✗ TTS başarısız, atlanıyor.")
                continue

            # 3. Video birleştir
            print("  → Video birleştiriliyor...")
            ok = compose_video(frame_path, audio_path, out_path, 90)
            if ok:
                size_mb = os.path.getsize(out_path) / 1024 / 1024
                print(f"  ✓ Üretildi: {out_path} ({size_mb:.1f} MB)")
                produced.append(out_path)
            else:
                print("  ✗ Video birleştirme başarısız.")

    print("\n" + "=" * 60)
    print(f"  Tamamlandı: {len(produced)}/{len(BROADCASTS)} video")
    for p in produced:
        print(f"  ✓ {p}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
