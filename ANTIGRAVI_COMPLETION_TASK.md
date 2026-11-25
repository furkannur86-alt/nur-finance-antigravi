# AntiGravi IDE — Tamamlama Görev Listesi

> **Durum**: 2026-11-25 itibarıyla proje analizi
> **Branch**: `claude/ide-project-completion-wlgbbk`
> **Framework**: Next.js 16.3.3 + React 19 + Tailwind 4 + Zustand + Supabase + Electron

---

## 1. MEVCUT DURUM ÖZETİ

### Yapılanlar
| Alan | Durum | Detay |
|------|-------|-------|
| Panel registry | 184 panel kayıtlı | 8 grup: ANALYSIS(108), MARKETS(17), TRADING(15), MEDIA(11), SOVEREIGN(9), SOCIAL(8), GALACTIC(8), CORE(7) |
| Component dosyaları | 179 Panel.tsx dosyası | Tüm 184 registry girişinin component dosyası mevcut (bazıları paylaşımlı) |
| Page.tsx switch | 51 panel inline | Geri kalan 132+ panel FloatingWindowManager ile açılıyor |
| PricingPanel | Mevcut (542 satır) | Explorer(Free), Smart Mining(Free), Analyst(€255/ay), Professional, NUR Finance R, NUR Finance B tiers |
| NUR Finance B/R kuralları | PricingPanel'de gösteriliyor | 1yr Bloomberg/Reuters history, invitation, transition kuralları yazılmış |
| VerificationPanel | Mevcut | Bloomberg/Reuters history doğrulama, invitation code, email verification akışı |
| Auth sistemi | Supabase entegre | useSupabaseAuth hook, AccountAuthModal, SovereignAuthModal |
| Electron masaüstü | Yapı mevcut | electron-main.js, electron/, preload.ts, bridge.ts, desktop script |
| Design system | CSS custom properties | --ag-accent, --ag-bg, --ag-surface, dark theme |
| Supabase DB | Lib yapısı mevcut | supabase.ts, financial-database.ts, ingest.ts |
| EODHD market data | Entegre | eodhd.ts ile batch veri çekme |

### Eksikler & Kritik Sorunlar

**132 panel sadece FloatingWindow'da** — ana sayfada (page.tsx switch) değil. Kullanıcı sidebar'dan tıklayınca bu paneller sadece floating window olarak açılıyor, main content area'da görünmüyor.

---

## 2. KRİTİK GÖREVLER (Video İçin Öncelikli)

### 2.1 Üyelik/Plan Gating Sistemi (FREE vs PAID Görünümler)

**Sorun**: Şu anda tüm paneller herkese açık görünüyor. Free kullanıcı ile €255/ay Analyst veya €100K/yr NUR Finance B arasında runtime fark yok.

**Yapılacaklar**:
- [ ] `useIDEStore`'a `userPlan: PlanTier` state ekle (default: "free")
- [ ] `PlanGate` wrapper component oluştur — `minPlan` kontrolü yapan, kilitli panellerde "Upgrade" overlay gösteren
- [ ] Sidebar'da kilitli panellere 🔒 ikonu ekle
- [ ] Free plan: Sadece `minPlan: "free"` olan 23 panele erişim
- [ ] Pro plan: free + `minPlan: "pro"` olan 82 panel
- [ ] Quant plan: free + pro + `minPlan: "quant"` olan 65 panel
- [ ] Team/B/R: Tüm paneller
- [ ] "Upgrade to Pro" / "Upgrade to Quant" CTA butonları kilitli panellerde
- [ ] **Video için**: Bir "demo mode" toggle veya URL param (?plan=quant) ile tam sürüm gösterilebilsin

**Dosyalar**: `src/stores/useIDEStore.ts`, yeni `src/components/ui/PlanGate.tsx`, `src/components/layout/Sidebar.tsx`

### 2.2 Video Demo Mode (€199 Full Görünüm)

**Sorun**: Video çekerken tüm özelliklerin çalıştığı tam sürüm görünmeli.

**Yapılacaklar**:
- [ ] URL param `?demo=full` veya `?plan=b` ile plan override
- [ ] Tüm paneller açık, tüm floating window'lar çalışır
- [ ] Demo watermark/badge gösterme seçeneği (video'da "DEMO" yazmasın)
- [ ] Fake kullanıcı profili: "FURKAN — NUR Finance B Member" gibi üst bar'da görünsün
- [ ] Tüm veri panelleri dolu data ile gelsin (zaten demo data var, sorun yok)

**Dosyalar**: `src/app/page.tsx` (URL param okuma), `src/stores/useIDEStore.ts`

### 2.3 Masaüstü Terminal Deneyimi

**Sorun**: Masaüstünde açılan terminaller üyelik istiyor, free'den geçiliyor ama full halini görmek lazım.

**Yapılacaklar**:
- [ ] Electron açılışında plan kontrolü — `.env` veya local storage'dan plan oku
- [ ] Masaüstü'de "Analyst" veya "Professional" olarak başlasın (video için)
- [ ] Terminal panellerin (NURTerminalPanel, UmayBossTerminal, CivilizationTerminalPanel) plan gate'leri çalışsın
- [ ] `electron-main.js` → window title'da plan seviyesi göstersin
- [ ] Tray menu'de plan bilgisi

**Dosyalar**: `electron-main.js`, `electron/main.ts`, `electron/preload.ts`, `src/lib/electron/bridge.ts`

---

## 3. WEB SİTESİ GÖRÜNTÜLENMESİ

### 3.1 Landing Page & SEO

**Mevcut**: `src/app/page.tsx` direkt IDE'yi açıyor (login yok).

**Yapılacaklar**:
- [ ] Landing page (opsiyonel) veya direkt IDE aç — ama üst bar'da login/signup butonu
- [ ] `src/app/layout.tsx` metadata zaten mevcut ve iyi
- [ ] Open Graph image oluştur (sosyal medya paylaşımı için)
- [ ] `robots.ts` ve `sitemap.ts` mevcut — kontrol et, güncel mi

### 3.2 Routing & Pages

**Mevcut routes**: `/`, `/agb`, `/datenschutz`, `/impressum`, `/widerruf` (Alman hukuki sayfalar)

**Yapılacaklar**:
- [ ] Bu yasal sayfaların içeriği dolu mu kontrol et
- [ ] `/pricing` ayrı route olarak ekle (şu anda sidebar'dan açılıyor)
- [ ] `/login` ve `/signup` sayfaları (Supabase auth ile)

---

## 4. PANEL VE TERMİNAL KALİTESİ

### 4.1 Panel Görüntüleme Tutarlılığı

**Yapılacaklar**:
- [ ] 132 floating-only panel için: en önemli 20-30 tanesini page.tsx switch'e de ekle (ya da dynamic import ile generic handler)
- [ ] Alternatif: `renderMainContent()` fonksiyonunda default case'i FloatingWindowManager mantığıyla değiştir — registry'deki her panel main area'da da açılsın
- [ ] Her panelin 4 tab'ının çalıştığını doğrula
- [ ] Demo data tutarlılığı — tarihler, fiyatlar, isimler gerçekçi mi

### 4.2 Panel'den Panel'e Navigasyon

**Yapılacaklar**:
- [ ] Sidebar'da grup bazlı navigasyon (GALACTIC, CORE, MARKETS, TRADING, ANALYSIS, MEDIA, SOCIAL, SOVEREIGN)
- [ ] Command Palette (Cmd+K) tüm 184 paneli arayabilsin
- [ ] Son açılan paneller listesi (recent)

---

## 5. VERİ & BACKEND

### 5.1 Demo vs Live Data

**Mevcut**: 135+ panel DemoBadge kullanıyor (demo data). EODHD entegre ama API key olmadan çalışmıyor.

**Yapılacaklar**:
- [ ] Demo data panelleri kusursuz çalışsın (API key gerekmeden)
- [ ] EODHD API key varsa live data'ya geçiş (`dataMode: "live"` olan paneller)
- [ ] Supabase bağlantısı yoksa graceful fallback (demo mode)
- [ ] Her panel kendi mock data'sını barındırsın (zaten çoğu barındırıyor)

### 5.2 Supabase Tabloları

**Yapılacaklar**:
- [ ] `users` tablosu: id, email, plan, bloomberg_history_months, reuters_history_months, invitation_code, verified_at
- [ ] `sessions` tablosu: login tracking
- [ ] `audit_log` tablosu: compliance için
- [ ] SQL migration dosyaları oluştur (`src/lib/db/migrations/`)
- [ ] NUR Finance B invitation sistemi backend: invitation kodu oluşturma, email doğrulama

---

## 6. COMPONENT LİBRARY OLUŞTURULMASI

### 6.1 Paylaşılan UI Primitives

**Mevcut**: `src/components/ui/` dizini (DemoBadge, EagleCrest, vb.)

**Yapılacaklar**:
- [ ] `src/components/ui/index.ts` — tüm shared UI componentlerin barrel export'u
- [ ] **PanelShell** — Tüm panellerin ortak wrapper'ı: header (icon + title + badge + demo), tab bar, scrollable content area
- [ ] **DataTable** — Sortable, filterable tablo (çoğu panel tablo gösteriyor)
- [ ] **StatCard** — Metrik kartı (value, label, change, color)
- [ ] **ProgressBar** — Yüzde göstergesi (birçok panelde tekrarlanan pattern)
- [ ] **StatusBadge** — Active/Inactive/Degraded/Error durumları
- [ ] **SparklineChart** — Küçük inline SVG chart
- [ ] **TabBar** — Ortak tab navigasyonu (her panel kendi tab'ını yazıyor, standardize et)
- [ ] **PlanBadge** — Bloomberg PB / Reuters FX / NUR GALACTIC gibi branding badge'leri
- [ ] **CurrencyDisplay** — Para birimi formatlama ($, €, ¥, ₿)
- [ ] **TimeAgo** — "2h ago", "5m ago" gibi relative time
- [ ] **BlinkingDot** — Live/connected göstergesi
- [ ] **TickerSymbol** — Hisse sembolü (renk kodlu, tıklanabilir)

### 6.2 Layout Components

**Yapılacaklar**:
- [ ] **SplitPane** — Yeniden boyutlandırılabilir iki panel (çoğu terminal bu pattern'i kullanıyor)
- [ ] **GridLayout** — Dashboard grid sistemi
- [ ] **Drawer** — Sağdan/soldan açılan panel

### 6.3 Chart Components

**Yapılacaklar**:
- [ ] **CandlestickChart** — OHLC mum grafiği (SVG tabanlı, dış kütüphane yok)
- [ ] **LineChart** — Zaman serisi çizgi grafik
- [ ] **BarChart** — Yatay/dikey bar grafik
- [ ] **HeatMap** — Renk matriksi (correlation, sector heat map)
- [ ] **DonutChart** — Portfolio allocation, sector dağılımı
- [ ] **AreaChart** — Dolgu alanı grafik (yield curve, cumulative return)

### 6.4 Storybook / Showcase Page

**Yapılacaklar**:
- [ ] `/components` route veya panel ile tüm UI componentleri görüntüle
- [ ] Her component'in kullanım örnekleri
- [ ] Light/dark theme preview

---

## 7. MD DOSYALARI & DOKÜMANTASYON

### 7.1 Mevcut MD'ler

| Dosya | İçerik | Durum |
|-------|--------|-------|
| `README.md` | Proje tanıtımı | Güncellenmeli |
| `CLAUDE.md` | AI agent kuralları | Güncel |
| `AGENTS.md` | Next.js uyarıları | Güncel |
| `CLAUDE_PLAN.md` | Geliştirme planı | Kontrol et |
| `PROJECT_AUDIT.md` | Proje denetimi | Kontrol et |
| `README_PRODUCTION.md` | Production notları | Kontrol et |
| `CHARACTERS_MASTER_REGISTRY.md` | Karakter kayıtları | Kontrol et |
| `PATENTS_AND_IP.md` | Patent/IP deklaresi | Kontrol et |
| `NUR_COIN_AND_BLOCKCHAIN_ARCHITECTURE.md` | Blockchain mimari | Kontrol et |
| `docs/strategy/` | 4 strateji dokümanı | Son commit'te güncellendi |

### 7.2 Eksik/Güncellenecek MD'ler

**Yapılacaklar**:
- [ ] `README.md` — Proje açıklaması, kurulum, çalıştırma, panel listesi, ekran görüntüleri
- [ ] `CHANGELOG.md` — Versiyon geçmişi (v3.0.0)
- [ ] `ARCHITECTURE.md` — Teknik mimari: Next.js + Zustand + Supabase + Electron + EODHD
- [ ] `PANEL_CATALOG.md` — 184 panelin tam listesi (grup, açıklama, minPlan, dataMode)
- [ ] `DEPLOYMENT.md` — Vercel deploy, env variables listesi, Supabase setup
- [ ] `ELECTRON_BUILD.md` — Masaüstü uygulaması build süreci
- [ ] `API_REFERENCE.md` — EODHD, Supabase API endpoint'leri
- [ ] `BUSINESS_RULES.md` — NUR Finance B/R erişim kurallarının teknik implementasyon detayları
- [ ] `docs/strategy/` güncelle — Mevcut 184 panel gerçeğini yansıtsın

---

## 8. ELECTRON MASAÜSTÜ UYGULAMASI

### 8.1 Mevcut Yapı
- `electron-main.js` (root entry)
- `electron/main.ts`, `electron/preload.ts`, `electron/gpu-worker.ts`
- `src/lib/electron/bridge.ts` (renderer-side safe wrapper)
- `package.json`: `"desktop"` ve `"desktop:build"` scriptleri

### 8.2 Yapılacaklar
- [ ] `electron-builder.yml` veya `electron-builder` config kontrol et
- [ ] Windows, macOS, Linux build test
- [ ] Auto-updater entegrasyonu
- [ ] Tray icon ve menü
- [ ] GPU mining worker (`gpu-worker.ts`) — Smart Mining Access için
- [ ] Native menu bar (File, View, Tools, Help)
- [ ] Splash screen / loading screen
- [ ] Offline mode: Demo data ile çalışsın internet olmadan

---

## 9. ÖNCELİK SIRASI (Video Çekimi İçin)

### Faz 1 — Acil (Video öncesi)
1. **Plan gating + demo mode** — `?plan=b` ile full NUR Finance B görünümü
2. **renderMainContent default case** — 132 floating-only panelin main area'da da açılması
3. **Sidebar grup navigasyonu** — Tüm 184 panelin düzgün listelenmesi
4. **TopBar'da kullanıcı bilgisi** — "FURKAN | NUR Finance B | Full Access"

### Faz 2 — Kısa Vadeli
5. Component library oluşturma (PanelShell, DataTable, StatCard, TabBar)
6. Supabase auth flow (login/signup/logout)
7. README.md ve PANEL_CATALOG.md güncelleme
8. Electron masaüstü build test

### Faz 3 — Orta Vadeli
9. Backend plan enforcement (Supabase RLS)
10. NUR Finance B invitation sistemi
11. EODHD live data entegrasyonu
12. Tüm MD'lerin tamamlanması
13. Chart component library

### Faz 4 — Uzun Vadeli
14. Production deployment (Vercel)
15. Electron auto-update
16. Payment integration (Stripe)
17. Bloomberg/Reuters history verification API
18. Mobile responsive optimizasyon

---

## 10. TEKNİK BORÇ

- [ ] 108 ANALYSIS paneli vs 7-17 diğer gruplar — dengesiz dağılım
- [ ] `page.tsx` 300+ satır switch statement — dynamic rendering'e geçilmeli
- [ ] Her panel kendi styling'ini inline yapıyor — shared token'lara geçilmeli
- [ ] TypeScript strict mode kontrolleri
- [ ] `next build` hata kontrolü — tüm importlar çözülüyor mu
- [ ] Bundle size analizi — 184 panel lazy loading doğru çalışıyor mu

---

## ÖZET SAYILAR

| Metrik | Değer |
|--------|-------|
| Toplam .tsx/.ts dosyası | 339 |
| Panel component dosyaları | 179 |
| Registry girişleri | 184 |
| Page.tsx switch'teki paneller | 51 |
| Floating-only paneller | 132 |
| Plan tipleri | 6 (free, pro, quant, team, r, b) |
| Free paneller | 23 |
| Pro paneller | 82 |
| Quant paneller | 65 |
| Team paneller | 9 |
| NUR Finance B paneller | 4 |
| Gruplar | 8 |
| Mevcut MD dosyaları | 12+ |
| Hukuki sayfalar | 4 (AGB, Datenschutz, Impressum, Widerruf) |
| Supabase entegrasyonu | Auth + DB hazır (env key gerekli) |
| EODHD entegrasyonu | Hazır (API key gerekli) |
| Electron yapısı | Hazır (build test gerekli) |
