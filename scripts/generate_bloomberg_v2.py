"""
NUR Finance — Bloomberg Broadcast v2 (Optimized)
1 yüksek kalite frame (Python) + ffmpeg drawtext ticker + TTS audio.
Üretim süresi: ~30-60 saniye/video.
"""

import asyncio, os, subprocess, tempfile, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

OUT_DIR = Path("output/bloomberg_v2")
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1280, 720

def load_font(name, size):
    path = f"C:/Windows/Fonts/{name}"
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()

# ── Renkler ────────────────────────────────────────────────────────
TEAL   = (0, 212, 170)
RED    = (220, 40,  40)
GREEN  = (40,  200, 100)
AMBER  = (240, 170, 30)
BLUE   = (60,  140, 255)
WHITE  = (255, 255, 255)
MUTED  = (140, 160, 180)
DARK   = (4,   8,   18)

# ── Piyasa verileri ─────────────────────────────────────────────────
CARDS = [
    ("DAX 40",   "17,821", "▼ 2.31%", RED),
    ("EUR/USD",  "1.0712", "▼ 0.43%", RED),
    ("BUND 10Y", "2.91%",  "▲ 0.09",  GREEN),
    ("DE CDS",   "38 bp",  "▲ 18 bp", AMBER),
    ("GOLD",     "$2,418", "▲ 1.40%", GREEN),
    ("CHF/EUR",  "0.9340", "▲ 0.62%", GREEN),
    ("VIX",      "19.4",   "▲ 3.20",  AMBER),
]

TICKER = (
    "   NUR FINANCE LIVE   ◆   DAX 40 ▼2.31%  17,821   ◆   "
    "EUR/USD ▼0.43%  1.0712   ◆   BUND 10Y ▲2.91%   ◆   "
    "GOLD ▲1.40%  $2,418   ◆   CHF ▲0.62%   ◆   "
    "AFD RİSK: YÜKSEK   ◆   DAX 12 AY PROJEKSİYON -%8   ◆   "
    "VW ▼3.1%   SIEMENS ▼1.9%   BASF ▼2.6%   ◆   "
    "ALMAN BUND SPREAD GENİŞLİYOR   ◆   NUR FINANCE   ◆   "
)

# ── Ana sahne karesini oluştur ─────────────────────────────────────
def build_frame(bg_path: str, cfg: dict) -> Image.Image:
    # Arka plan
    bg = Image.open(bg_path).convert("RGB").resize((W, H), Image.LANCZOS)

    # Hafif blur + koyu overlay — karakter öne çıksın
    blurred = bg.filter(ImageFilter.GaussianBlur(radius=1))
    bg = Image.blend(bg, blurred, 0.25)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_ov = ImageDraw.Draw(overlay)
    # Soldan sağa koyulaşan gradient (sunucu tarafı koyu, veri tarafı daha az)
    for x in range(W):
        a = int(90 * max(0, 1 - x / (W * 0.65)))
        d_ov.line([(x, 0), (x, H)], fill=(0, 0, 0, a))
    bg.paste(overlay, mask=overlay.split()[3])

    draw = ImageDraw.Draw(bg)
    accent = cfg.get("accent", TEAL)

    # ── Üst bar ────────────────────────────────────────────────────
    draw.rectangle([(0, 0), (W, 60)], fill=(0, 0, 0))
    draw.rectangle([(0, 57), (W, 60)], fill=accent)
    # NUR kutusu
    draw.rectangle([(0, 0), (210, 60)], fill=accent)
    fb = load_font("arialbd.ttf", 44)
    draw.text((14, 6), "NUR", font=fb, fill=(0, 0, 0))
    # Kanal adı
    fs = load_font("arialbd.ttf", 20)
    draw.text((226, 18), cfg["channel"], font=fs, fill=(220, 228, 240))
    # Şehir
    city_x = 226 + int(fs.getlength(cfg["channel"])) + 20
    fw = int(fs.getlength(cfg["city"])) + 20
    draw.rectangle([(city_x, 14), (city_x + fw, 48)], fill=(18, 32, 52))
    draw.text((city_x + 10, 18), cfg["city"], font=fs, fill=accent)
    # LIVE
    draw.ellipse([(W - 88, 18), (W - 72, 34)], fill=RED)
    draw.text((W - 67, 16), "LIVE", font=fs, fill=RED)
    # Saat
    fc = load_font("arialbd.ttf", 18)
    draw.text((W - 190, 20), "20:47 CET", font=fc, fill=MUTED)

    # ── Başlık ─────────────────────────────────────────────────────
    ft = load_font("arialbd.ttf", 34)
    draw.text((18, 72), cfg["headline"], font=ft, fill=(220, 228, 240))
    if cfg.get("subhead"):
        fr = load_font("arial.ttf", 18)
        draw.text((18, 116), cfg["subhead"], font=fr, fill=MUTED)

    # ── BREAKING banner ────────────────────────────────────────────
    if cfg.get("show_breaking"):
        by = H - 240
        draw.rectangle([(0, by), (W, by + 48)], fill=(170, 16, 16))
        draw.rectangle([(0, by), (210, by + 48)], fill=(120, 8, 8))
        fb2 = load_font("arialbd.ttf", 18)
        draw.text((14, by + 12), "BREAKING", font=fb2, fill=WHITE)
        draw.text((226, by + 12),
                  "AFD TARİHİN EN YÜKSEK OY ORANINI ALDI — ALMAN PİYASALARI DÜŞÜŞTE",
                  font=fb2, fill=WHITE)

    # ── Sağ veri kartları ──────────────────────────────────────────
    fln = load_font("arial.ttf",    15)
    fval= load_font("arialbd.ttf", 38)
    fchg= load_font("arialbd.ttf", 17)
    px, py0 = W - 320, 74
    ch = 90
    for i, (lbl, val, chg, color) in enumerate(CARDS):
        cy = py0 + i * (ch + 4)
        # Kart arkaplanı
        card_overlay = Image.new("RGBA", (310, ch), (5, 10, 22, 195))
        bg.paste(card_overlay, (px, cy), card_overlay)
        draw.rectangle([(px, cy), (px + 4, cy + ch)], fill=color)
        draw.text((px + 12, cy + 6),  lbl, font=fln,  fill=MUTED)
        draw.text((px + 12, cy + 26), val, font=fval,  fill=WHITE)
        draw.text((px + 12, cy + 68), chg, font=fchg,  fill=color)

    # ── Lower third ────────────────────────────────────────────────
    y0 = H - 188
    bw = 640
    lt_overlay = Image.new("RGBA", (bw, 72), (3, 8, 20, 220))
    bg.paste(lt_overlay, (0, y0), lt_overlay)
    draw.rectangle([(0, y0), (7, y0 + 72)], fill=accent)
    draw.rectangle([(0, y0 + 68), (bw, y0 + 72)], fill=(*accent, 160))
    fn  = load_font("arialbd.ttf", 30)
    fro = load_font("arial.ttf",   18)
    draw.text((20, y0 + 6),  cfg["presenter_name"], font=fn,  fill=WHITE)
    draw.text((20, y0 + 44), cfg["presenter_role"], font=fro, fill=accent)

    # ── Watermark ──────────────────────────────────────────────────
    fw2 = load_font("arialbd.ttf", 15)
    draw.text((W - 220, H - 84), "NUR FINANCE", font=fw2, fill=(*MUTED, 180))
    draw.rectangle([(W - 222, H - 58), (W - 14, H - 55)], fill=accent)

    # ── Ticker bar (statik — ffmpeg drawtext kullanmadan) ──────────
    draw.rectangle([(0, H - 44), (W, H)], fill=(0, 0, 0))
    draw.rectangle([(0, H - 44), (W, H - 42)], fill=accent)
    # NUR kutusu (sol)
    draw.rectangle([(0, H - 44), (130, H)], fill=(*accent, 220))
    fb_tick = load_font("arialbd.ttf", 17)
    draw.text((8, H - 31), "NUR FINANCE", font=fb_tick, fill=(0, 0, 0))
    # Ticker metni (soldan 140px'den başla)
    ft_tick = load_font("arialbd.ttf", 16)
    draw.text((148, H - 31), TICKER.strip(), font=ft_tick, fill=WHITE)

    return bg


# ── TTS ────────────────────────────────────────────────────────────
async def tts(text, voice, rate, out):
    import edge_tts
    await edge_tts.Communicate(text, voice, rate=rate).save(out)
    return os.path.exists(out) and os.path.getsize(out) > 500


# ── ffmpeg: Ken Burns zoom + audio (gerçek video hareketi) ─────────
def compose(frame_jpg: str, audio_mp3: str, out_mp4: str) -> bool:
    # Yavaş zoom: 1.0x → 1.06x, görsel hareket yaratır (fotoğraf gibi görünmez)
    vf = (
        "zoompan="
        "z='min(zoom+0.0002,1.06)':"
        "x='iw/2-(iw/zoom/2)':"
        "y='ih/2-(ih/zoom/2)':"
        "d=25000:"
        f"s={W}x{H},"
        "fps=25"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", frame_jpg,
        "-i", audio_mp3,
        "-vf", vf,
        "-c:v", "libx264", "-preset", "fast", "-crf", "22",
        "-c:a", "aac", "-b:a", "192k", "-ac", "2",
        "-shortest",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        out_mp4,
    ]
    r = subprocess.run(cmd, capture_output=True, timeout=300)
    if r.returncode != 0:
        print("  ffmpeg stderr:", r.stderr.decode()[-600:])
    return r.returncode == 0


# ── Broadcast tanımları ────────────────────────────────────────────
BROADCASTS = [
    {
        "id":    "umay-frankfurt-ceo",
        "bg":    "public/images/studio/anchor-female.jpg",
        "channel":  "FINANCE DEUTSCHLAND",
        "city":     "FRANKFURT",
        "headline": "AFD SEÇİM ANALİZİ — CEO RAPORU",
        "subhead":  "Piyasa Tepkisi  ·  Risk Değerlendirmesi  ·  Yatırımcı Tavsiyesi",
        "presenter_name": "Umay Gül Nur",
        "presenter_role": "Kurucu CEO · NUR Finance · Frankfurt",
        "accent":   TEAL,
        "show_breaking": True,
        "voice":  "tr-TR-EmelNeural",
        "rate":   "-4%",
        "script": (
            "Merhaba. Ben Umay Gül Nur. NUR Finance'ın kurucusuyum ve Frankfurt ofisimden yayındayım. "
            "Bugün piyasaların en kritik gündemini, AfD'nin seçim zaferini, tamamen finansal bir gözle ele alıyoruz. "
            "Duyguları bir kenara bırakın. Rakamlar konuşsun. "
            "Almanya, Avrupa'nın en büyük ekonomisi. Euro Bölgesi gayri safi yurt içi hasılasının yüzde yirmi sekizini oluşturuyor. "
            "Bir Alman hükümetinin istikrarsızlaşması, tüm kıtayı etkiler. Ve bugün piyasalar bunu fiyatladı. "
            "DAX Kırk, seçim sonuçlarının ardından ilk iki saatte yüzde iki nokta üç oranında değer kaybetti. "
            "Euro, dolar karşısında üç aylık en düşük seviyesine geriledi: bir nokta sıfır yedi. "
            "Alman devlet tahvillerinin kredi temerrüt swap primleri, yani CDS, on sekiz baz puan yükseldi. "
            "Bu ne anlama geliyor? Piyasalar Almanya'ya ek risk fiyatlıyor. "
            "AfD'nin üç temel politikası, uluslararası yatırımcılar için doğrudan tehdit oluşturuyor. "
            "Birincisi, Avrupa Birliği ve Euro karşıtı söylem. "
            "Merkez Bankası bağımsızlığının sorgulanması ya da Almanya'nın Euro Bölgesi taahhütlerinden geri çekilmesi, "
            "Volkswagen'i, Siemens'i, BASF'ı ve Alman ihracatının tamamını doğrudan etkiler. "
            "İkincisi, göç kısıtlaması. Almanya'nın şu an dört yüz bin nitelikli işçi açığı var. "
            "Bu açığı kapatamazsanız büyüme durur, üretkenlik düşer, bütçe gelirleri azalır. "
            "Üçüncüsü, enerji politikası. AfD yenilenebilir enerjiyi kesmek, kömür ve doğal gazı uzatmak istiyor. "
            "Bu politika, Alman sanayisine iki bin otuz karbon hedefleri çerçevesinde yüz milyarlarca Euro ceza ödetirir. "
            "NUR Finance'ın on iki aylık projeksiyonu şu: "
            "Eğer AfD etkili bir koalisyon kurarsa, DAX sekiz ila on iki puan daha değer kaybeder. "
            "Alman tahvil spread'leri genişlemeye devam eder. "
            "Reyting kuruluşları Almanya'nın üçlü A notunu gözden geçirebilir. "
            "Yatırımcılara net tavsiyemiz şu: "
            "Alman varlık ağırlığınızı azaltın. "
            "İsviçre Frangı, Norveç Kronu ve İskandinav tahvillerine pozisyon alın. "
            "Altındaki hedge pozisyonunuzu koruyun. "
            "Ben Umay Gül Nur, Frankfurt'tan. NUR Finance ile güncel kalın."
        ),
    },
    {
        "id":    "new-york-correspondent",
        "bg":    "public/images/studio/anchor-male.jpg",
        "channel":  "FINANCE AMERICAS",
        "city":     "NEW YORK",
        "headline": "GERMANY POLITICAL SHOCK — MARKET IMPACT",
        "subhead":  "DAX Selloff  ·  EUR/USD Pressure  ·  Sovereign Spread Widening",
        "presenter_name": "Marcus V. Rhodes",
        "presenter_role": "Senior Markets Correspondent · NUR Finance New York",
        "accent":   BLUE,
        "show_breaking": False,
        "voice":  "en-US-AriaNeural",
        "rate":   "+0%",
        "script": (
            "Good evening from New York. This is NUR Finance Americas, live from our Manhattan desk. "
            "The political shockwave out of Germany is reverberating through global markets tonight. "
            "On Wall Street, European-exposed ETFs saw heavy selling in afternoon trading. "
            "The iShares MSCI Germany ETF dropped three point one percent. "
            "Volkswagen's US-listed ADRs fell over four percent. "
            "Here is what our models at NUR Finance show. "
            "The AfD's historic result creates three distinct risk vectors for international investors. "
            "First: currency risk. The euro is structurally weaker in any scenario "
            "where Germany's commitment to European integration is in question. "
            "Our six-month EUR-USD target moves down from one-ten to one-oh-four. "
            "Second: sovereign bond risk. German bund yields are rising, "
            "and the spread between German and French bonds is widening — "
            "a classic flight-from-core signal. "
            "Third: corporate earnings risk. Germany's export engine — "
            "automotive, chemicals, and industrials — "
            "depends on open borders, skilled labor, and stable energy costs. "
            "AfD policies threaten all three pillars simultaneously. "
            "NUR Finance recommendation for US-based investors: "
            "Reduce European equity overweights. "
            "Rotate into Swiss, Nordic, and US domestic exposure. "
            "Hedge euro exposure through FX options with six-month duration. "
            "The risk-adjusted case for German assets just got materially worse. "
            "This is Marcus Rhodes, NUR Finance Americas, New York. Back to you."
        ),
    },
    {
        "id":    "executive-office-analysis",
        "bg":    "public/images/studio/executive-office.jpg",
        "channel":  "FINANCE GLOBAL",
        "city":     "FRANKFURT — ÖZEL ANALİZ",
        "headline": "AFD RİSK RAPORU — GİZLİ BÜLTEN",
        "subhead":  "Kurumsal Yatırımcı Brifingi  ·  NUR Finance Research Masası",
        "presenter_name": "Katharina Weiss",
        "presenter_role": "Başekonomist · NUR Finance Deutschland · Frankfurt",
        "accent":   TEAL,
        "show_breaking": True,
        "voice":  "de-DE-KatjaNeural",
        "rate":   "+0%",
        "script": (
            "Guten Abend. Willkommen beim exklusiven NUR Finance Institutionellen Briefing. "
            "Ich spreche heute Abend aus unserem Frankfurter Büro, direkt nach Börsenschluss. "
            "Die Bundestagswahl hat ein historisches Ergebnis gebracht — "
            "und die Finanzmärkte haben unmissverständlich reagiert. "
            "Der DAX verlor in den ersten Handelsstunden nach der Ergebnisbekanntgabe zwei Komma drei Prozent. "
            "Der Euro fiel auf den niedrigsten Stand seit drei Monaten: eins Komma null sieben. "
            "Die Credit Default Swap Prämien auf deutsche Staatsanleihen stiegen um achtzehn Basispunkte. "
            "Das ist ein klares Signal: Die Märkte preisen politisches Risiko ein. "
            "NUR Finance bewertet die wirtschaftlichen Risiken der AfD-Positionen als erheblich — und strukturell. "
            "Erstens: Euro-Skepsis und EU-Kritik. "
            "Jeder Zweifel an der deutschen Eurozone-Verpflichtung destabilisiert den gesamten Währungsraum. "
            "Unsere Modelle zeigen eine mögliche Spread-Ausweitung von dreißig bis fünfzig Basispunkten. "
            "Zweitens: Migrationsbeschränkungen. Deutschland braucht jährlich vierhunderttausend Fachkräfte. "
            "Ohne diese schrumpft das Wachstum, fallen Steuereinnahmen, steigen Sozialkosten. "
            "Drittens: Energiepolitik-Rückschritt. "
            "Deutsche Industrieunternehmen haben Hunderte Milliarden Euro in die Energiewende investiert. "
            "Eine politische Kehrtwende würde zu massiven Wertberichtigungen führen. "
            "NUR Finance Empfehlung für institutionelle Anleger: "
            "Untergewichten Sie deutsche Staatsanleihen. "
            "Bauen Sie Positionen in Schweizer Franken, norwegischen Kronen und nordischen Titeln auf. "
            "Reduzieren Sie die DAX-Exportpositionen — insbesondere Automobil und Chemie. "
            "Das war das NUR Finance Institutionelle Briefing aus Frankfurt. Bleiben Sie informiert."
        ),
    },
]


async def main():
    print("=" * 65)
    print("  NUR Finance — Bloomberg-Grade Production v2")
    print("  Optimized: 1 frame + ffmpeg drawtext ticker")
    print("=" * 65)
    produced = []

    for bc in BROADCASTS:
        print(f"\n▶ [{bc['id']}]")

        out_path = str(OUT_DIR / f"{bc['id']}.mp4")

        with tempfile.TemporaryDirectory() as tmp:
            frame_path = os.path.join(tmp, "frame.jpg")
            audio_path = os.path.join(tmp, "audio.mp3")

            # 1. Frame
            print("  → Stüdyo kadrası render ediliyor...")
            frame = build_frame(bc["bg"], bc)
            frame.save(frame_path, "JPEG", quality=94)
            print(f"     {frame.size[0]}×{frame.size[1]} px — OK")

            # 2. TTS
            print(f"  → Ses üretiliyor ({bc['voice']}, rate={bc['rate']})...")
            ok = await tts(bc["script"], bc["voice"], bc["rate"], audio_path)
            if not ok:
                print("  ✗ TTS başarısız"); continue
            size_kb = os.path.getsize(audio_path) // 1024
            print(f"     {size_kb} KB ses — OK")

            # 3. Video
            print("  → ffmpeg: video + scrolling ticker...")
            ok = compose(frame_path, audio_path, out_path)
            if ok:
                mb = os.path.getsize(out_path) / 1e6
                print(f"  ✓ Hazır: {out_path}  ({mb:.1f} MB)")
                produced.append(out_path)
            else:
                print("  ✗ Video başarısız")

    print("\n" + "=" * 65)
    print(f"  Tamamlandı: {len(produced)}/{len(BROADCASTS)} video")
    for p in produced:
        print(f"  ✓ {p}")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(main())
