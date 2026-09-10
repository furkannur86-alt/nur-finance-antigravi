"""
NUR Finance — Bloomberg-Grade Broadcast Producer
Gerçek stüdyo fotoğrafları üzerine profesyonel overlay kompozisyonu.
Umay Gül Nur (Frankfurt CEO sahnesi) + New York muhabiri.
"""

import asyncio, os, subprocess, tempfile, math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

OUT_DIR = Path("output/bloomberg_broadcast")
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
FPS = 25

# ── Font yükleyici ─────────────────────────────────────────────────
def fonts():
    bases = [
        "C:/Windows/Fonts/",
        "C:/Windows/Fonts/",
    ]
    def load(name, size):
        for b in ["C:/Windows/Fonts/"]:
            p = b + name
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
        return ImageFont.load_default()

    return {
        "brand":   load("arialbd.ttf",  46),
        "brand_sm":load("arialbd.ttf",  22),
        "title":   load("arialbd.ttf",  36),
        "name":    load("arialbd.ttf",  32),
        "role":    load("arial.ttf",    20),
        "data_lg": load("arialbd.ttf",  42),
        "data_sm": load("arialbd.ttf",  18),
        "ticker":  load("arialbd.ttf",  17),
        "label":   load("arial.ttf",    16),
        "clock":   load("arialbd.ttf",  20),
    }

F = fonts()

# ── Renkler ────────────────────────────────────────────────────────
NUR_TEAL   = (0, 212, 170)
NUR_DARK   = (0, 140, 110)
RED        = (220, 40,  40)
GREEN      = (40,  200, 100)
AMBER      = (240, 170, 30)
WHITE      = (255, 255, 255)
OFF_WHITE  = (220, 228, 240)
MUTED      = (140, 160, 180)
BG_PANEL   = (8,   14,  26,  210)   # RGBA
BG_DARK    = (4,   8,   16,  230)
TICKER_BG  = (2,   6,   14)

# ── Piyasa verileri ─────────────────────────────────────────────────
MARKET_DATA = [
    ("DAX 40",     "17,821", "▼ 2.31%", RED),
    ("EUR/USD",    "1.0712", "▼ 0.43%", RED),
    ("BUND 10Y",   "2.91%",  "▲ 0.09",  GREEN),
    ("DE CDS",     "38 bp",  "▲ 18 bp", AMBER),
    ("GOLD",       "$2,418", "▲ 1.40%", GREEN),
    ("CHF/EUR",    "0.9340", "▲ 0.62%", GREEN),
    ("VIX",        "19.4",   "▲ 3.2",   AMBER),
    ("MDAX",       "24,103", "▼ 1.87%", RED),
]

TICKER_TEXT = (
    "  NUR FINANCE  |  DAX ▼2.31%  17,821  |  "
    "EUR/USD ▼0.43%  1.0712  |  BUND 10Y ▲2.91%  |  "
    "GOLD ▲1.40%  $2,418  |  CHF ▲0.62%  |  "
    "AFD RİSK SKORU: YÜKSEK  |  DAX 12 AYLIK PROJEKSIYON: -%8  |  "
    "VW ▼3.1%  SIEMENS ▼1.9%  BASF ▼2.6%  |  "
    "ALMAN TAHVİL SPREAD ARTIYOR  |  "
    "NUR FINANCE  |  "
)

SCRIPTS = {
    "umay_frankfurt": {
        "voice":  "tr-TR-EmelNeural",
        "rate":   "-3%",
        "text": (
            "Merhaba. Ben Umay Gül Nur. NUR Finance'ın kurucusuyum ve şu an Frankfurt ofisimden yayındayım. "
            "Bugün Almanya gündeminin tartışmasız en kritik konusunu, "
            "yani AfD'nin seçim zaferini, tamamen finansal bir perspektiften ele alacağız. "
            "Duyguları bir kenara bırakın. Rakamlar konuşsun. "
            "Almanya, Avrupa'nın en büyük ekonomisi. Euro Bölgesi'nin yüzde yirmi sekizini oluşturuyor. "
            "Bir Alman hükümetinin istikrarsızlaşması, tüm kıtayı etkiler. "
            "AfD'nin oy oranındaki bu tarihi artışın ardından piyasalar anında tepki verdi. "
            "DAX kırk, ilk iki saatte yüzde iki buçuk değer kaybetti. "
            "Euro, dolar karşısında üç aylık en düşük seviyesine geriledi: 1 virgül 07 12. "
            "Alman devlet tahvillerinin kredi temerrüt swap primleri, "
            "yani CDS, on sekiz baz puan fırladı. "
            "Bu ne anlama geliyor? Piyasalar Almanya'ya ek risk fiyatlıyor. "
            "AfD'nin üç temel politikası, yatırımcılar için doğrudan tehdit oluşturuyor. "
            "Birincisi, Avrupa Birliği ve Euro karşıtı söylem. "
            "Bir euro çıkışı veya Merkez Bankası bağımsızlığının zayıflaması, "
            "Alman ihracat şirketlerini, yani Volkswagen'i, Siemens'i, BASF'ı doğrudan vurur. "
            "İkincisi, göç kısıtlaması. "
            "Almanya'nın şu an 400.000 nitelikli işçi açığı var. "
            "Bu açığı kapatamazsanız, büyüme durur. "
            "Üçüncüsü, enerji politikası. AfD yenilenebilir enerjiyi kesmek, "
            "kömür ve doğalgazı uzatmak istiyor. "
            "Bu politika, 2030 karbon hedefleri nedeniyle Alman sanayisine "
            "yüz milyarlarca Euro ceza ödetirir. "
            "NUR Finance'ın 12 aylık projeksiyonu şu: "
            "AfD etkili bir koalisyon kurarsa, DAX sekiz ila on iki puan daha değer kaybeder. "
            "Alman Bund tahvilleri düşer, spread genişler. "
            "Reyting kuruluşları Almanya'nın AAA notunu gözden geçirebilir. "
            "Yatırımcılara tavsiyemiz nettir: "
            "Alman varlık ağırlığınızı azaltın. "
            "İsviçre Frangı, Norveç Kronu ve İskandinav tahvillerine pozisyon alın. "
            "Altında hedge pozisyonunu koruyun. "
            "Ben Umay Gül Nur, Frankfurt'tan. NUR Finance ile güncel kalın."
        ),
    },
    "ny_correspondent": {
        "voice": "en-US-AriaNeural",
        "rate":  "+0%",
        "text": (
            "Good evening from New York. I'm reporting live from the NUR Finance Americas desk. "
            "The political shockwave out of Germany is being felt across global markets tonight. "
            "On Wall Street, European-exposed ETFs saw heavy selling in early trading. "
            "The iShares MSCI Germany ETF dropped three point one percent. "
            "Volkswagen's US-listed ADRs fell over four percent. "
            "Here's what our models at NUR Finance show. "
            "The AfD's rise creates three distinct risk vectors for international investors. "
            "First: currency risk. The euro is structurally weaker in any scenario "
            "where Germany's commitment to European integration is in question. "
            "Our 6-month EUR-USD target moves down from 1.10 to 1.04. "
            "Second: sovereign bond risk. German bund yields are rising, "
            "and the spread between German and French bonds is widening. "
            "This is a classic flight-from-core signal. "
            "Third: corporate earnings risk. "
            "Germany's export engine — automotive, chemicals, industrials — "
            "depends on open borders, cheap skilled labor, and stable energy costs. "
            "AfD policies threaten all three pillars simultaneously. "
            "NUR Finance recommendation for US-based investors: "
            "Reduce European equity overweights. Rotate to Swiss, Nordic, and US domestic exposure. "
            "Hedge euro exposure through FX options with 6-month duration. "
            "The risk-adjusted case for German assets just got materially worse. "
            "This is the NUR Finance Americas desk. I'll have more throughout the evening."
        ),
    },
    "frankfurt_studio": {
        "voice": "de-DE-KatjaNeural",
        "rate":  "+0%",
        "text": (
            "Guten Abend. Willkommen bei NUR Finance Deutschland, live aus Frankfurt. "
            "Die Bundestagswahl hat ein historisches Ergebnis gebracht — "
            "und die Reaktion der Finanzmärkte war unmissverständlich. "
            "Der DAX verlor in den ersten Handelsstunden zwei Komma drei Prozent. "
            "Der Euro fiel auf den tiefsten Stand seit drei Monaten. "
            "NUR Finance bewertet die wirtschaftlichen Risiken der AfD-Plattform als erheblich. "
            "Punkt eins: Euro-Skepsis. "
            "Jeder Zweifel an der deutschen Eurozone-Bindung "
            "destabilisiert den gesamten europäischen Währungsraum. "
            "Unsere Modelle zeigen eine mögliche Ausweitung der Risikoprämien um dreißig bis fünfzig Basispunkte. "
            "Punkt zwei: Arbeitskräftemangel. "
            "Die AfD will die Zuwanderung drastisch begrenzen. "
            "Deutschland benötigt jedoch jährlich vierhunderttausend Fachkräfte aus dem Ausland. "
            "Ohne diese Arbeitskräfte schrumpft das Wachstum. "
            "Punkt drei: Energiewende-Rückschritt. "
            "Deutsche Industrieunternehmen haben Hunderte Milliarden Euro "
            "in die grüne Transformation investiert. "
            "Eine Kehrtwende würde zu massiven Abschreibungen führen. "
            "NUR Finance Empfehlung: "
            "Untergewichten Sie deutsche Staatsanleihen. "
            "Bauen Sie Positionen in Schweizer Franken und skandinavischen Titeln auf. "
            "Das war NUR Finance Deutschland, Frankfurt. Bleiben Sie informiert."
        ),
    },
}

# ── Yardımcı: RGBA katmanını RGB üzerine yapıştır ──────────────────
def paste_rgba(base: Image.Image, overlay: Image.Image, pos=(0, 0)):
    base.paste(overlay, pos, overlay)

# ── Alt veri satırı (ticker) ────────────────────────────────────────
def draw_ticker(draw, offset: int, text: str, y: int, height: int = 44):
    draw.rectangle([(0, y), (W, y + height)], fill=TICKER_BG)
    draw.rectangle([(0, y), (W, y + 2)], fill=NUR_TEAL)
    # Scrolling text (offset ile kaydır)
    full = text * 3
    draw.text((-offset % (W + 2000), y + 10), full, font=F["ticker"], fill=OFF_WHITE)

# ── NUR Finance üst banner ─────────────────────────────────────────
def draw_top_bar(draw, channel: str, city: str, time_str: str = "20:47 CET"):
    draw.rectangle([(0, 0), (W, 64)], fill=(0, 0, 0))
    draw.rectangle([(0, 60), (W, 64)], fill=NUR_TEAL)

    # Sol: NUR Finance logo kelimesi
    draw.rectangle([(0, 0), (220, 60)], fill=NUR_TEAL)
    draw.text((14, 8), "NUR", font=F["brand"], fill=(0, 0, 0))

    # Kanal adı
    draw.text((234, 18), channel, font=F["brand_sm"], fill=OFF_WHITE)

    # Şehir badge
    bx = 234 + F["brand_sm"].getlength(channel) + 18
    draw.rectangle([(bx, 16), (bx + F["brand_sm"].getlength(city) + 20, 48)],
                   fill=(20, 35, 55))
    draw.text((bx + 10, 18), city, font=F["brand_sm"], fill=NUR_TEAL)

    # Saat (sağ)
    draw.text((W - 180, 18), time_str, font=F["clock"], fill=MUTED)

    # CANLI badge
    draw.ellipse([(W - 84, 20), (W - 68, 36)], fill=RED)
    draw.text((W - 63, 18), "LIVE", font=F["brand_sm"], fill=RED)

# ── Lower third (alt kimlik şeridi) ───────────────────────────────
def draw_lower_third(img: Image.Image, name: str, role: str, accent=(0, 212, 170)):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    y0 = H - 190
    bar_w = int(F["name"].getlength(name)) + int(F["role"].getlength(role)) + 80
    bar_w = max(bar_w, 520)

    # Ana panel
    d.rectangle([(0, y0), (bar_w, y0 + 72)], fill=(4, 10, 22, 220))
    # Accent çizgi
    d.rectangle([(0, y0), (8, y0 + 72)], fill=(*accent, 255))
    d.rectangle([(0, y0 + 68), (bar_w, y0 + 72)], fill=(*accent, 180))
    # Metin
    d.text((20, y0 + 8),  name, font=F["name"], fill=WHITE)
    d.text((20, y0 + 44), role, font=F["role"], fill=(*accent,))
    paste_rgba(img, overlay)

# ── Sağ veri paneli ─────────────────────────────────────────────────
def draw_data_panel(img: Image.Image):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    px, py0 = W - 330, 80
    card_h = 96

    for i, (lbl, val, chg, color) in enumerate(MARKET_DATA):
        cy = py0 + i * (card_h + 6)
        d.rectangle([(px, cy), (px + 310, cy + card_h)],
                    fill=(6, 12, 24, 200))
        d.rectangle([(px, cy), (px + 4, cy + card_h)], fill=(*color, 255))
        d.text((px + 14, cy + 10), lbl, font=F["label"], fill=(*MUTED,))
        d.text((px + 14, cy + 32), val,  font=F["data_lg"], fill=(*WHITE,))
        d.text((px + 14, cy + 72), chg,  font=F["data_sm"], fill=(*color,))

    paste_rgba(img, overlay)

# ── "BREAKING" banner ──────────────────────────────────────────────
def draw_breaking_banner(img: Image.Image, text: str):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    y = H - 240
    d.rectangle([(0, y), (W, y + 52)], fill=(180, 20, 20, 230))
    d.rectangle([(0, y), (200, y + 52)], fill=(140, 10, 10, 255))
    d.text((12, y + 12), "BREAKING", font=F["brand_sm"], fill=WHITE)
    d.text((218, y + 12), text, font=F["brand_sm"], fill=WHITE)
    paste_rgba(img, overlay)

# ── Sahne oluşturucu ────────────────────────────────────────────────
def make_scene(bg_path: str, cfg: dict, ticker_offset: int,
               show_breaking: bool = False) -> Image.Image:
    # Arka plan
    bg = Image.open(bg_path).convert("RGB").resize((W, H), Image.LANCZOS)

    # Koyu overlay (sol 55% — sunucu alanı daha okunabilir)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_ov = ImageDraw.Draw(overlay)
    for x in range(W):
        alpha = int(120 * (1 - x / W * 0.5)) if x < W * 0.6 else 30
        d_ov.line([(x, 0), (x, H)], fill=(0, 0, 0, alpha))
    paste_rgba(bg, overlay)

    draw = ImageDraw.Draw(bg)

    # Üst bar
    draw_top_bar(draw, cfg["channel"], cfg["city"])

    # Başlık (sol üst, banner altı)
    draw.text((18, 76), cfg["headline"], font=F["title"], fill=OFF_WHITE)
    if cfg.get("subhead"):
        draw.text((18, 120), cfg["subhead"], font=F["role"], fill=MUTED)

    # Sağ veri paneli
    draw_data_panel(bg)

    # Breaking banner (isteğe bağlı)
    if show_breaking:
        draw_breaking_banner(bg, "AFD TARİHİN EN YÜKSEK OY ORANINA ULAŞTI — PİYASALAR DÜŞÜŞTE")

    # Lower third
    draw_lower_third(bg, cfg["presenter_name"], cfg["presenter_role"],
                     accent=cfg.get("accent", NUR_TEAL))

    # Alt ticker
    draw_ticker(draw, ticker_offset, TICKER_TEXT,
                y=H - 44, height=44)

    # NUR Finance watermark sağ alt
    draw.text((W - 230, H - 86), "NUR FINANCE", font=F["brand_sm"], fill=MUTED)
    draw.rectangle([(W - 232, H - 60), (W - 12, H - 57)], fill=NUR_TEAL)

    return bg

# ── Çoklu frame → video ─────────────────────────────────────────────
def render_video_frames(bg_path: str, cfg: dict, tmp_dir: str, n_frames: int = 200):
    """n_frames kare üretir — ticker kayar, canlı his verir."""
    frame_dir = os.path.join(tmp_dir, "frames")
    os.makedirs(frame_dir, exist_ok=True)
    show_breaking = cfg.get("show_breaking", False)

    for i in range(n_frames):
        offset = i * 4   # ticker her karede 4px kayar
        frame = make_scene(bg_path, cfg, ticker_offset=offset,
                           show_breaking=(show_breaking and i < 80))
        frame.save(os.path.join(frame_dir, f"frame_{i:05d}.jpg"),
                   "JPEG", quality=90)

    return frame_dir

def compose_video(frame_dir: str, audio_path: str, out_path: str) -> bool:
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", os.path.join(frame_dir, "frame_%05d.jpg"),
        "-i", audio_path,
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        out_path,
    ]
    r = subprocess.run(cmd, capture_output=True, timeout=600)
    return r.returncode == 0

async def generate_tts(text: str, voice: str, rate: str, out_path: str) -> bool:
    try:
        import edge_tts
        c = edge_tts.Communicate(text, voice, rate=rate)
        await c.save(out_path)
        return os.path.exists(out_path) and os.path.getsize(out_path) > 1000
    except Exception as e:
        print(f"  TTS hata: {e}")
        return False

# ── Broadcast konfigürasyonları ────────────────────────────────────
BROADCAST_CONFIGS = [
    {
        "id": "umay_frankfurt",
        "bg": "public/images/studio/anchor-female.jpg",
        "script_key": "umay_frankfurt",
        "channel": "FINANCE DEUTSCHLAND",
        "city": "FRANKFURT",
        "headline": "AFD SEÇİM ANALİZİ — CEO RAPORU",
        "subhead": "Piyasa Tepkisi · Risk Değerlendirmesi · Yatırımcı Tavsiyesi",
        "presenter_name": "Umay Gül Nur",
        "presenter_role": "Kurucu CEO · NUR Finance · Frankfurt Ofisi",
        "accent": NUR_TEAL,
        "show_breaking": True,
    },
    {
        "id": "ny_correspondent",
        "bg": "public/images/studio/anchor-male.jpg",
        "script_key": "ny_correspondent",
        "channel": "FINANCE AMERICAS",
        "city": "NEW YORK",
        "headline": "GERMANY POLITICAL SHOCK — MARKET IMPACT",
        "subhead": "DAX Selloff · EUR/USD Pressure · Sovereign Spread Widening",
        "presenter_name": "Marcus V. Rhodes",
        "presenter_role": "Senior Markets Correspondent · NUR Finance New York",
        "accent": (80, 160, 255),
        "show_breaking": False,
    },
    {
        "id": "executive_office",
        "bg": "public/images/studio/executive-office.jpg",
        "script_key": "frankfurt_studio",
        "channel": "FINANCE DEUTSCHLAND",
        "city": "FRANKFURT — CEO BÜROSU",
        "headline": "AFD-WAHL: FINANZMARKT-ANALYSE",
        "subhead": "DAX · EUR/USD · Bund Spreads · Industrierisiko",
        "presenter_name": "Katharina Weiss",
        "presenter_role": "Chefanalystin Deutschland · NUR Finance",
        "accent": NUR_TEAL,
        "show_breaking": True,
    },
]

# ── Ana üretim ─────────────────────────────────────────────────────
async def main():
    print("=" * 65)
    print("  NUR Finance — Bloomberg-Grade Broadcast Production")
    print("=" * 65)

    produced = []

    for cfg in BROADCAST_CONFIGS:
        print(f"\n▶  [{cfg['id']}]  {cfg['channel']} / {cfg['city']}")
        script_data = SCRIPTS[cfg["script_key"]]
        out_path = str(OUT_DIR / f"{cfg['id']}.mp4")

        with tempfile.TemporaryDirectory() as tmp:
            audio_path = os.path.join(tmp, "audio.mp3")

            # 1. TTS
            print(f"   → Ses üretiliyor ({script_data['voice']}, rate={script_data['rate']})...")
            ok = await generate_tts(
                script_data["text"],
                script_data["voice"],
                script_data["rate"],
                audio_path,
            )
            if not ok:
                print("   ✗ TTS başarısız"); continue

            # Ses süresi hesapla → kaç frame?
            r = subprocess.run(
                ["ffprobe", "-v", "error", "-show_entries",
                 "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audio_path],
                capture_output=True, text=True
            )
            try:
                dur = float(r.stdout.strip())
            except Exception:
                dur = 90.0
            n_frames = int(dur * FPS) + FPS  # 1 saniye buffer

            print(f"   → Ses süresi: {dur:.1f}s → {n_frames} kare render edilecek")

            # 2. Frame'ler
            print("   → Stüdyo kareleri render ediliyor...")
            frame_dir = render_video_frames(cfg["bg"], cfg, tmp, n_frames)

            # 3. Video
            print("   → Video birleştiriliyor (H.264 / AAC)...")
            ok = compose_video(frame_dir, audio_path, out_path)
            if ok:
                mb = os.path.getsize(out_path) / 1e6
                print(f"   ✓ Hazır: {out_path}  ({mb:.1f} MB)")
                produced.append(out_path)
            else:
                print("   ✗ ffmpeg başarısız")

    print("\n" + "=" * 65)
    print(f"  Tamamlandı: {len(produced)}/{len(BROADCAST_CONFIGS)} video")
    for p in produced:
        print(f"  ✓ {p}")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(main())
