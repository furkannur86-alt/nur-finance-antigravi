# 01 — Teknik Öneriler

[← İçindekiler](./README.md)

## 1. Mevcut Durum (kod tabanından doğrulanan)

| Alan | Durum | Kaynak |
|------|-------|--------|
| Çatı | Next.js 16.3.3 (Turbopack), React 19, Tailwind 4, Zustand, TypeScript `strict` | `package.json`, `tsconfig.json` |
| Boyut | ~200 TS/TSX dosyası, 39 bileşen dizini, 28 API dizini, 56 panel türü | `src/` |
| Gerçek veri | Piyasa (EODHD), makro (FRED), çatışma (ACLED), RSS | `PROJECT_AUDIT.md` §2 |
| Sahte veri | Yeni 6 analiz paneli dâhil panellerin çoğu; `/api/ai/analyze`, `/api/social`, `/api/content` | kod |
| Kimlik / yetki | Yok. `middleware`/`proxy` dosyası yok; yönetici girişi tarayıcıda parola | kod |
| Ödeme | Kripto adresleri bileşen içinde sabit yazılı (`DigitalWalletGateway.tsx`) | kod |
| CI | `tsc` + lint + build; yalnızca `main`/`base` ve PR'larda | `.github/workflows/ci.yml` |
| Test | Test dosyaları var ama `vitest` ve Testing Library kurulu değil, `npm test` komutu yok | `package.json` |
| Ortam şablonu | README `.env.example`'a atıf yapıyor, dosya yok | repo kökü |

## 2. Mimari Öneriler

### 2.1 Panel kayıt defteri (tek doğruluk kaynağı)

Yeni bir panel eklemek bugün 4 dosyada elle değişiklik istiyor (`types/index.ts`, `FloatingWindowManager`,
`ModuleLauncher`, `StatusBar`). 56 panelde bu, hata üretir.

Öneri: tek bir `src/panels/registry.ts`:

```ts
export const PANELS = {
  "risk-dashboard": {
    label: "Risk Dashboard", statusLabel: "RISK DASHBOARD", group: "ANALYSIS",
    icon: "🛡", color: "#ef4444", minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/RiskDashboardPanel"),
  },
  // …
} as const;
export type PanelView = keyof typeof PANELS;
```

`PanelView` tipi, başlatıcı listesi, durum çubuğu etiketi, dinamik import ve **plan yetkisi** bu tablodan
türetilir. `dataMode: "demo" | "delayed" | "live"` alanı DEMO rozetini otomatik basar.

### 2.2 Veri katmanı

| Sorun | Öneri |
|-------|-------|
| Her panel kendi sahte verisini taşıyor | `src/lib/data-sources/` altında kaynak başına tek istemci; paneller yalnızca hook çağırır (`useQuote`, `useFundamentals`) |
| API anahtarı sunucuda, önbellek yok | Route Handler + önbellek (kotasyon 15 sn, temel veri 24 saat, makro 6 saat). Next 16 önbellek API'si için `node_modules/next/dist/docs/` okunmalı (`AGENTS.md` uyarısı) |
| EODHD kotası | Sunucu taraflı istek birleştirme (aynı sembol için tek çağrı) + Supabase'de günlük OHLCV arşivi |
| Tek sağlayıcı riski | Sağlayıcı arayüzü (`MarketDataProvider`) — ikinci kaynak sonradan takılabilsin |

### 2.3 Durum yönetimi

`useIDEStore` tek mağaza olarak büyüyor. Dilimlere bölün (`layout`, `windows`, `watchlists`, `session`) ve
yalnızca kullanıcı tercihlerini `persist` edin. `WatchlistManagerPanel` şu an doğrudan `localStorage`
kullanıyor; giriş yapan kullanıcıda Supabase'e taşınmalı (cihazlar arası eşitleme = Pro özelliği).

### 2.4 Performans

- 56 panel `dynamic(..., { ssr: false })` ile doğru yükleniyor; ek olarak paket analizi (`three`, `chart.js`
  yalnızca kullanan panelde yüklensin).
- Uzun tablolar için sanallaştırma; Monte Carlo ve tarayıcı hesapları Web Worker'a.
- Hedefler: LCP < 2,5 sn, panel açılışı < 300 ms, ana paket < 250 KB gzip.

## 3. Güvenlik

| # | Bulgu | Öneri | Öncelik |
|---|-------|-------|--------|
| S1 | Yönetici parolaları belgede ve istemci kodunda | Supabase Auth + `role` alanı + RLS; yönetici rotaları sunucuda kontrol | Acil |
| S2 | `/api/execute` kullanıcı kodu alıyor | Yalnızca simülasyon modunda kalsın; gerçek çalıştırma gerekiyorsa izole servis (Firecracker/gVisor) ve süre/bellek sınırı | Acil |
| S3 | API rotalarında hız sınırı yok | IP + kullanıcı başına sınır (Upstash/Redis), pahalı rotalarda plan kotası | Yüksek |
| S4 | Cüzdan adresleri kaynak kodda | Sunucu ortam değişkenine alın; adres değişimi yeniden dağıtım gerektirmesin; ödeme doğrulama yalnızca sunucuda | Yüksek |
| S5 | `/api/cron/*`, `/api/umay/*`, `/api/fleet/*` | `CRON_SECRET` başlığı + yönetici oturumu zorunlu; her çağrı denetim kaydına | Yüksek |
| S6 | Güvenlik başlıkları | CSP, HSTS, `X-Frame-Options`, `Referrer-Policy` (`next.config.ts`) | Orta |
| S7 | Gizli anahtar sızıntısı | GitHub secret scanning + push protection açık; `.env.example` eklensin (yalnızca isimler) | Orta |
| S8 | Bağımlılıklar | Dependabot + `npm audit` CI adımı | Orta |

## 4. Veri Lisansı ve Uyum (teknik etkisi olanlar)

- **Gecikmeli / gerçek zamanlı ayrımı** her kotasyonda görünür olmalı (`15 dk gecikmeli` etiketi).
- **Kaynak atfı**: her panelin altbilgisinde veri kaynağı ve zaman damgası.
- **"Yatırım tavsiyesi değildir"** uyarısı: analiz ve sinyal üreten her panelde sabit altbilgi.
- **GDPR**: çerez onayı, veri işleme kaydı, silme/dışa aktarma uçları, AB bölgesinde barındırma.
- **Saat etiketi hatası**: `StatusBar` saati `toLocaleTimeString` ile yerel saati gösterip "UTC" yazıyor;
  `timeZone: "UTC"` eklenmeli. Finans ürününde yanlış saat etiketi küçük ama görünür bir güven hatasıdır.

## 5. B/R Erişim Kurallarının Sunucuda Uygulanması

`CLAUDE.md` kuralları değişmez; aşağısı yalnızca **nasıl uygulanacağı** önerisidir.

```sql
-- supabase/entitlements.sql (taslak)
create type product as enum ('R', 'B');
create type history_status as enum ('none', 'pending', 'verified', 'rejected');

create table entitlements (
  user_id uuid primary key references auth.users,
  active_product product,
  reuters_history history_status not null default 'none',
  bloomberg_history history_status not null default 'none',
  bloomberg_started_at date,            -- R→B geçişinde 1 yıl sayacı
  invitation_id uuid references invitations,
  invitation_confirmed_at timestamptz,
  r_permanently_banned boolean not null default false,
  updated_at timestamptz not null default now()
);

create table invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  issued_by uuid not null references auth.users,  -- yalnızca leadership rolü
  token_hash text not null,                       -- düz token saklanmaz
  expires_at timestamptz not null,
  confirmed_at timestamptz
);
```

Kurallar tek bir saf fonksiyonda toplanır ve birim testleriyle kilitlenir:

| Test senaryosu | Beklenen |
|----------------|----------|
| Reuters geçmişi < 1 yıl → R | RED |
| Bloomberg 1 yıl var, davet yok → B | RED |
| Davet var, Bloomberg geçmişi yok → B | RED |
| Bloomberg 1 yıl + onaylı davet → B | KABUL |
| B → R | KABUL (koşulsuz) |
| R → B, Bloomberg < 1 yıl | RED |
| R → B, Bloomberg 1 yıl + R aktif + davet | KABUL |
| Geçiş sırasında hem Bloomberg hem R kapatıldı | R kalıcı yasak, geri alınamaz |

Geçmiş doğrulaması belge yükleme + insan onayı ile başlar (`pending → verified`); her karar
`audit_log` tablosuna kim/ne zaman/hangi belge ile yazılır. Davet e-postası tek kullanımlık, süreli,
imzalı bağlantı ile onaylanır ("bu e-postanın sahibiyim").

## 6. Test ve Kalite

| Katman | Araç | Kapsam hedefi |
|--------|------|---------------|
| Birim | Vitest | `lib/financial`, `lib/strategies`, yetki fonksiyonu: %90+ |
| Bileşen | Testing Library + jsdom | Her panel: açılıyor, başlık ve ana tablo görünüyor |
| Uçtan uca | Playwright | Kayıt → ödeme → panel açma; B/R ret senaryoları |
| Sözleşme | Hardhat | `NurCoin.sol` (coin planı sürerse) |

Hemen yapılacak: `vitest`, `@testing-library/react`, `jsdom` dev bağımlılığı + `"test": "vitest run"` +
CI'da `npm test` adımı. Mevcut `__tests__` dosyaları bu kurulmadan çalışmıyor. Ayrıca CI tetikleyicisine
`claude/**` dalları eklenmeli; şu an bu dallardaki push'lar denetlenmiyor.

Finansal doğruluk testi ayrı bir sınıftır: VaR, Sharpe, Piotroski, Altman, Beneish hesapları için bilinen
girdilerle **altın değer** testleri (bağımsız bir kaynakla, örn. Python `numpy`/`pandas` çıktısı ile
karşılaştırma). `RiskDashboardPanel`'deki Monte Carlo şu an normal dağılım yerine düzgün dağılım
kullanıyor (`Math.random()*2-1`) ve "medyan yol" olarak dizinin ortasındaki yolu çiziyor; gerçek veriye
geçmeden önce Box–Muller ile normal örnekleme ve gerçek yüzdelik bantlarla düzeltilmeli.

## 7. Dağıtım ve Operasyon

| Konu | Öneri |
|------|-------|
| Ortamlar | `preview` (her PR), `staging`, `production`; ayrı Supabase projeleri |
| Barındırma | Web: Vercel (AB bölgesi). Video/FFmpeg/RTMP: ayrı VPS veya iş kuyruğu — sunucusuz fonksiyonlarda uzun render çalışmaz |
| İzleme | Sentry (hata), Vercel Analytics (web vitals), çalışma süresi izleme, EODHD kota alarmı |
| Yedek | Supabase günlük yedek + aylık geri yükleme provası |
| Sürümleme | `CHANGELOG.md`, anlamsal sürüm, dal koruması, PR şablonu |
| Belgeler | `docs/adr/` altında kısa mimari karar kayıtları; README yalnızca kurulum + bu kılavuza bağlantı |

## 8. Teknik Borç — Dondurulması Önerilenler

Gelir üretmeyen ve bakım yükü getiren alanlar bir `experimental/` bayrağının arkasına alınsın, ana
başlatıcıda görünmesin: galaktik filo / medeniyet panelleri, madencilik botları, Electron madenci,
alt zincir, POS terminali. Silmeyin; özellik bayrağı ile gizleyin. 56 panel yerine **12 kusursuz panel**
satış sayfasında çok daha güçlü durur.