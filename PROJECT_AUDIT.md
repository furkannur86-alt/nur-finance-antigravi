# NUR Finance AntiGravi — Proje Denetim ve Organizasyon Raporu

## 1. PROJE MİMARİSİ — MEVCUT DURUM

```
nur-finance-antigravi/
├── src/                          # Ana uygulama (Next.js 16 + React 19)
│   ├── app/                      # Routes + API
│   │   ├── page.tsx              # Ana IDE sayfası (tüm panelleri yükler)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global stiller
│   │   └── api/                  # 18 API route (aşağıda analiz)
│   ├── components/               # 33 React bileşeni (17 alt dizin)
│   │   ├── layout/               # TopBar, Sidebar, StatusBar, CommandPalette
│   │   ├── dashboard/            # DashboardPanel, ChartsPanel, LiveWatchList, MetricsBar, WatchList, WatchListTicker
│   │   ├── terminal/             # TerminalPanel, NURTerminalPanel
│   │   ├── editor/               # CodeEditor, EditorTabs
│   │   ├── media/                # MediaPanel, LiveBroadcast (NUR TV)
│   │   ├── nfs/                  # MarketBriefsPanel, RiskAlertsPanel, ResearchPanel
│   │   ├── ai/                   # AIToolsPanel
│   │   ├── backtest/             # BacktestPanel
│   │   ├── derivatives/          # OptionsPanel
│   │   ├── encyclopedia/         # EncyclopediaPanel
│   │   ├── fundamentals/         # FundamentalsPanel
│   │   ├── geopolitics/          # GeopoliticsPanel
│   │   ├── ingest/               # DataIngestPanel
│   │   ├── markets/              # GlobalMarketsPanel, EconomicDataPanel
│   │   ├── news/                 # NewsFeedPanel
│   │   ├── portfolio/            # PortfolioManager
│   │   ├── pricing/              # PricingPanel (B/R kuralları entegre)
│   │   └── screener/             # ScreenerPanel
│   ├── lib/                      # İş mantığı + veri katmanı
│   │   ├── market/               # eodhd.ts, yahoo-finance.ts, fred.ts
│   │   ├── db/                   # supabase.ts, ingest.ts
│   │   ├── data/                 # broadcast.ts (1384 satır), encyclopedia.ts, mockMarketData.ts
│   │   ├── conflicts/            # acled.ts
│   │   ├── content/              # nfs-content.ts
│   │   ├── financial/            # functions.ts (quant fonksiyonlar)
│   │   ├── strategies/           # index.ts (backtest stratejileri)
│   │   ├── i18n/                 # translations.ts, config.ts
│   │   └── sample-files.ts       # IDE editör örnek dosyaları
│   ├── stores/                   # useIDEStore.ts (Zustand state)
│   ├── types/                    # index.ts (tüm TypeScript tipleri)
│   └── hooks/                    # BOŞ (kullanılmıyor)
├── core_engine/                  # Python medya pipeline
│   ├── tts_engine.py             # 4-backend TTS (Piper→Google→edge→espeak)
│   ├── broadcast_composer.py     # Video üretim (12 kanal)
│   ├── portrait_animator.py      # Mikro-hareket animasyonu
│   ├── portrait_generator.py     # 30 host portresi (Pillow)
│   └── heygen_integration.py     # HeyGen API (proxy engelli, kod hazır)
├── public/                       # Statik varlıklar
│   ├── assets/characters/        # 30 PNG portre (512x512)
│   └── videos/broadcasts/        # 12 MP4 + 12 poster JPG
├── supabase/                     # Veritabanı şemaları
│   ├── broadcast-schema.sql
│   └── historical-data-schema.sql
├── output/                       # Üretilen günlük özetler (gitignore'da)
│   └── daily_summaries/          # 12 kanal × (json+mp3+mp4+frame.png) + test dosyası
├── .github/workflows/ci.yml      # Lint + Build CI
├── CLAUDE.md                     # Proje kuralları + B/R erişim kuralları
├── AGENTS.md                     # Next.js 16 uyarısı
└── README.md                     # Varsayılan create-next-app (GÜNCELLENMELİ)
```

---

## 2. API ROUTE ANALİZİ

| Route | Gerçek API | Mock | Durum |
|-------|-----------|------|-------|
| `/api/market-data` | EODHD | — | ✅ Canlı |
| `/api/historical-data` | EODHD | — | ✅ Canlı |
| `/api/global-markets` | EODHD | — | ✅ Canlı |
| `/api/economic-data` | FRED | — | ✅ Canlı |
| `/api/fundamentals` | EODHD | — | ✅ Canlı |
| `/api/screener` | EODHD | — | ✅ Canlı |
| `/api/exchange-stocks` | EODHD | — | ✅ Canlı |
| `/api/indicators` | EODHD | — | ✅ Canlı |
| `/api/backtest` | Yerel hesaplama | — | ✅ Canlı |
| `/api/news-feed` | EODHD News | — | ✅ Canlı |
| `/api/news/rss` | RSS fetch | — | ✅ Canlı |
| `/api/conflicts` | ACLED/UCDP | — | ✅ Canlı |
| `/api/geo` | ACLED | — | ✅ Canlı |
| `/api/ingest-all` | Supabase + EODHD | — | ✅ Canlı |
| `/api/ai/analyze` | — | Yerel mock analiz | ⚠️ LLM bağlantısı yok |
| `/api/execute` | — | Sandbox yok | ⚠️ Kod çalıştırma yok |
| `/api/content` | — | Statik içerik | ⚠️ CMS bağlantısı yok |
| `/api/social` | — | Statik veri | ⚠️ Sosyal API yok |

---

## 3. ÇÖP KUTUSU — SİLİNEBİLECEK DOSYALAR

### 🔴 KESİNLİKLE SİLİN
| Dosya/Dizin | Neden |
|-------------|-------|
| `output/daily_summaries/test_gtts.mp3` | Boş test dosyası (0 byte) |
| `output/daily_summaries/*_frame.png` | Artık kullanılmayan eski statik frame'ler (animasyonlu videolara geçildi) |
| `README.md` | Varsayılan create-next-app README'si — projeye özgü değil |
| `src/hooks/` (boş dizin) | Kullanılmıyor, sadece yer tutuyor |

### 🟡 DİKKATLİ İNCELEYİN — KIYMETLİ OLABİLİR
| Dosya | İçerik | Tavsiye |
|-------|--------|---------|
| `src/lib/data/mockMarketData.ts` (89 satır) | Portfolio ve fiyat geçmişi üreten seeded random fonksiyonlar | **SAKLAT** — API çökünce fallback, demo modu için gerekli |
| `core_engine/heygen_integration.py` (250+ satır) | HeyGen API client, tam typed, avatar/video/webhook yönetimi | **SAKLAT** — production'da HeyGen açılınca direkt kullanılır |
| `core_engine/portrait_generator.py` | 30 host için Pillow ile geometrik portre üretici | **SAKLAT** — mevcut portrelerin kaynağı, yeniden üretim gerekebilir |
| `src/lib/sample-files.ts` (363 satır) | IDE editörde gösterilen örnek Python/JS dosyaları | **SAKLAT** — IDE deneyiminin parçası |
| `src/components/terminal/TerminalPanel.tsx` (271 satır) | CLI-style komut terminali (quote, rsi, backtest) — NURTerminalPanel ise Bloomberg-style ticker+haber ekranı | **SAKLA** — ikisi farklı iş yapıyor, ikisi de page.tsx'te kullanılıyor |

### 🟢 KESİNLİKLE SAKLAYIN
| Dosya | Neden |
|-------|-------|
| `src/lib/data/broadcast.ts` (1384 satır) | 30 host + 9 misafir + 12 kanal + 36 program — tüm NUR TV veritabanı |
| `src/lib/financial/functions.ts` (417 satır) | Sharpe, drawdown, VaR, Kelly, Sortino — quant çekirdeği |
| `src/lib/strategies/index.ts` (424 satır) | Backtest stratejileri (SMA, Bollinger, RSI, MACD, Momentum) |
| `src/lib/i18n/translations.ts` (423 satır) | 12 dil çeviri sistemi |
| `src/components/pricing/PricingPanel.tsx` (458 satır) | B/R erişim kuralları tam entegre |
| `core_engine/tts_engine.py` | 4-backend TTS, 15 kanal + 30 anchor eşlemesi, health check |
| `core_engine/broadcast_composer.py` | 12 kanal animasyonlu video üretimi |
| `core_engine/portrait_animator.py` | Nefes, baş sallanma, göz kırpma mikro-animasyonu |
| `supabase/*.sql` | Veritabanı şemaları — production için gerekli |

---

## 4. GÜVENLİK SORUNLARI — ACİL

| Sorun | Dosya | Eylem |
|-------|-------|-------|
| ⛔ `.env.local` API anahtarları açık | `.env.local` | Anahtarları yenile, .env.local git'e eklenmemiş ama sunucuda açık |
| ⚠️ EODHD token eski olabilir | `.env.local` | Yenilenmeli |
| ⚠️ FRED key eski olabilir | `.env.local` | Yenilenmeli |

> NOT: `.env.local` git'te izlenmiyor (.gitignore'da `.env*` var) — bu doğru.

---

## 5. EKSİKLER — MASTER PLAN'A GÖRE

### Faz 1 — Canlı Site (ACİL)
- [ ] `.env.example` dosyası yok — diğer geliştiriciler hangi anahtarların gerekli olduğunu bilmiyor
- [ ] README.md proje bilgisi yok — varsayılan Next.js şablonu
- [ ] Hukuki sayfalar yok: Impressum, Datenschutz, AGB, Widerruf
- [ ] Supabase auth entegrasyonu eksik (şema var, bağlantı yok)
- [ ] SEPA/PayPal ödeme akışı yok
- [ ] Production deploy konfigürasyonu yok

### Faz 2 — Medya + Platform
- [ ] AI analyze route gerçek LLM bağlantısı yok (mock analiz)
- [ ] Execute route sandbox yok (güvenlik riski)
- [ ] Social route gerçek API bağlantısı yok
- [ ] Content route CMS bağlantısı yok
- [ ] OBS entegrasyonu yok
- [ ] YouTube/TikTok upload API yok
- [ ] Subtitle burn-in sistemi yok
- [ ] 26 karakter görseli eksik (ImageFX promptları hazır, üretim yapılmalı)

---

## 6. SLAVE SESSION İÇİN TALİMAT SETİ

Diğer oturum bu branch'i (`claude/ide-project-completion-wlgbbk`) çektiğinde:

```bash
git fetch origin claude/ide-project-completion-wlgbbk
git checkout claude/ide-project-completion-wlgbbk
npm ci
```

### Kullanılabilir Komutlar:
```bash
# Frontend
npm run dev          # Next.js dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint

# Video üretim (Python)
python -c "from core_engine.broadcast_composer import compose_all; compose_all()"
python -c "from core_engine.tts_engine import health_check; import json; print(json.dumps(health_check(), indent=2))"

# Tek kanal video
python -c "from core_engine.broadcast_composer import compose_video; compose_video('nur-turkey')"
```

### Bağımlılıklar:
- Node.js 22+ (npm ci)
- Python 3.11+ (Pillow, piper-tts opsiyonel)
- ffmpeg, espeak-ng (sistem paketleri)
- EODHD_API_TOKEN, FRED_API_KEY (env vars)
