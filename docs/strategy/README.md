# NUR Finance — Master Strateji ve Operasyon Kılavuzu

| | |
|---|---|
| **Sürüm** | 1.0 (2026-11-16) |
| **Kapsam** | Ürün, teknik mimari, medya, haber, YouTube, yayın politikası, gelir modeli |
| **Durum** | Öneri dokümanı — kararlar kurucuya aittir |
| **Yerine geçtiği belgeler** | `CLAUDE_PLAN.md`, `CLAUDE_MEDIA_PRODUCTION_MASTER_PLAN.md`, `AUTONOMOUS_OVERNIGHT_MASTER_ROADMAP.md`, `PROJECT_AUDIT.md`, `README_PRODUCTION.md` (bunlar arşiv niteliğinde kalır) |
| **Değişmeyen belge** | `CLAUDE.md` — B/R erişim kuralları ve güvenlik kuralları aynen geçerlidir |

> Hukuki maddeler bilgilendirme amaçlıdır, hukuk danışmanlığı değildir. "Doğrulayın" notu olan her madde,
> lansmandan önce Almanya'da yetkili bir avukat / vergi danışmanı ile teyit edilmelidir.

## Bölümler

| # | Dosya | İçerik |
|---|-------|--------|
| 1 | [01-teknik.md](./01-teknik.md) | Mimari, kod kalitesi, güvenlik, veri lisansı, test, dağıtım |
| 2 | [02-medya-haber.md](./02-medya-haber.md) | Medya üretim hattı, karakter sistemi, haber masası, editoryal politika |
| 3 | [03-youtube.md](./03-youtube.md) | Kanal mimarisi, format planı, 24/7 yayın, YouTube ve yayın politikası |
| 4 | [04-gelir-ve-yol-haritasi.md](./04-gelir-ve-yol-haritasi.md) | Gelir modelleri, fiyatlandırma, genel fikirler, 90 günlük plan, KPI'lar |

---

## 1. Yönetici Özeti

Mevcut belgeler güçlü bir vizyon anlatıyor, ancak üç yapısal sorun var:

1. **Vizyon ile gerçek durum karışmış.** Belgeler "patentli", "tescilli", "%100 test kapsamı", "canlı" gibi
   ifadeler kullanıyor; kod tabanında ise panellerin çoğu sahte (mock) veriyle çalışıyor, ödeme ve kimlik
   doğrulama akışı yok, B/R erişim kuralları yalnızca arayüzde gösteriliyor. Profesyonel bir belge
   **"var olan"**, **"yapılmakta olan"** ve **"hedeflenen"** şeyi ayrı ayrı söyler.
2. **Odak dağılmış.** Terminal, coin, alt zincir, madencilik, oyun, flört, bahis, çocuk eğitimi, 18 medeniyet
   sitesi, 1.125 karakter, 24/7 TV. Tek kişilik/küçük ekipli bir girişim için bu, hiçbirinin bitmemesi
   demektir. Öneri: **tek ürün (terminal) + tek dağıtım kanalı (YouTube/medya)** ile gelir üretmek,
   geri kalanı gelir gelene kadar dondurmak.
3. **Bazı planlar şirketi hukuken ve platform nezdinde riske atıyor.** Aşağıdaki "Kritik Riskler" tablosu
   lansmandan önce çözülmesi gerekenleri sıralar.

**Tek cümlelik strateji önerisi:** *Almanca/Türkçe/İngilizce konuşan bireysel ve yarı-profesyonel yatırımcıya,
Bloomberg'in yüzde biri fiyatına gerçekten çalışan bir analiz terminali sat; müşteriyi, şeffaf biçimde AI
destekli üretilen günlük piyasa yayınlarıyla YouTube'dan kazan.*

---

## 2. Kritik Riskler (lansman öncesi çözülmeli)

| # | Risk | Nerede | Neden kritik | Öneri |
|---|------|--------|--------------|-------|
| R1 | **Yönetici parolaları repoda** | `README_PRODUCTION.md` §3 (`2126`, `UMAY-2126` …) | Parola herkese açık; ayrıca tarayıcıda kontrol edilen parola güvenlik sağlamaz | Belgeden silin, parolayı değiştirin, yönetici erişimini sunucu taraflı oturum + rol (Supabase Auth + RLS) ile yapın |
| R2 | **Kimliksiz (Zero-PII) ödeme + 1:1 USD sabitli $NUR + SEPA çıkışı** | Coin mimarisi, IP-9, deklarasyon | AB'de MiCA: USD'ye sabitli token ihracı e-para/kredi kuruluşu yetkisi ister; kripto hizmetleri CASP lisansı ve müşteri tanıma (KYC/AML) ister. "Kimliksiz + fiat çıkışı" birlikte mümkün değil (doğrulayın) | Kendi stablecoin'inizi ihraç etmeyin. Ödemeyi lisanslı sağlayıcıya bırakın (kart/SEPA: Stripe, Paddle; kripto: lisanslı ödeme geçidi). $NUR'u en fazla, devredilemeyen **sadakat puanı** olarak tutun |
| R3 | **"Gizli" AI persona ağı (NUR Dating, 1.125 karakter, sahte doktora unvanları)** | IP-4, karakter registrisi | Gerçek kişi gibi sunulan AI hesapları ve uydurma akademik unvanlar: platform kurallarına (YouTube/Meta/TikTok sentetik içerik ve kimliğe bürünme), AB haksız ticari uygulamalar hukukuna ve AB Yapay Zekâ Yasası şeffaflık yükümlülüklerine (md. 50, Ağustos 2026) aykırı. Kanal kapatma ve para cezası riski | Karakterleri **açıkça "AI sunucu"** olarak etiketleyin, sahte unvanları kaldırın, sayıyı 6–12 sunucuya indirin |
| R4 | **Bahis hunisi (Tatar Finans)** | IP-2 | Bahis arayüzü sunmak çoğu ülkede lisansa tabi; kumar kitlesini hedefleyen reklam ayrıca kısıtlı | Bahis mekaniğini çıkarın; "beklenen değer" eğitimini içerik serisi olarak koruyun |
| R5 | **Karşılanmamış "patentli / tescilli" beyanları** | `PATENTS_AND_IP.md` | Başvurusu yapılmamış buluş için "patentli" demek yanıltıcı beyandır; iş yöntemleri AB'de genelde patentlenemez | "Planlanan başvurular" olarak yeniden adlandırın; önce **marka** tescili (EUIPO: NUR Finance, logo) yapın |
| R6 | **Piyasa verisi yeniden dağıtım lisansı** | EODHD entegrasyonu | Kişisel/standart API planı, veriyi ücretli müşterilere veya yayında göstermeyi kapsamayabilir | EODHD'den ticari gösterim/yeniden dağıtım lisansını yazılı teyit edin; gerçek zamanlı borsa verisi ayrıca borsa ücretine tabidir |
| R7 | **B/R kuralları yalnızca arayüzde** | `VerificationPanel.tsx` | `CLAUDE.md` açıkça "backend zorunlu" diyor | Bkz. [01-teknik.md §5](./01-teknik.md) — sunucu taraflı yetki tablosu |
| R8 | **Kadın karakter tarifleri (beden ölçüsü, dekolte)** | Medya master planı | Reklamveren uygunluğu ve marka itibarı riski; finans kitlesinde güveni düşürür | Tüm sunucular için tek ölçüt: profesyonel yayın standardı kıyafet; fiziksel ölçü tarifi belgelerden çıkarılsın |
| R9 | **Sahte veri "gerçek zamanlı" etiketiyle** | Örn. `OptionsFlowPanel` başlığı "REAL-TIME SCAN" | Finans ürününde yanıltıcı veri etiketi en hızlı güven kaybıdır | Her panelde görünür **DEMO VERİ** rozeti; gerçek veri bağlanana kadar kaldırılmasın |

---

## 3. Belgeler Arası Tutarsızlıklar (düzeltilmeli)

| Konu | Belge A | Belge B | Karar gerekli |
|------|---------|---------|---------------|
| $NUR toplam arzı | 1.000.000.000 (coin mimarisi) | 54.751.113 (`CLAUDE_PLAN`, kontrat) | Tek rakam |
| Göz rengi kodu | `#2E8B57` (karakter registrisi) | `#00C853` (medya planı) | Tek marka rengi |
| Tüzel kişilik | "NUR Finance GmbH (i.Gr.)" (README) | "Technologies Inc." (IP) / "hiçbir kişiye ait değil" (deklarasyon) | Impressum için tek, gerçek tüzel kişi şart |
| Ödeme | "Yalnızca kripto, banka yok" | SEPA/PayPal akışı planlı, AGB/Widerruf sayfaları var | B2C AB satışı için kart/SEPA + cayma hakkı gerekli |
| Test | "%100 test kapsamı" | `package.json`'da test aracı ve `test` komutu yok | Bkz. 01-teknik §6 |
| Deklarasyon dosyası | `UMAY_GUL_NUR_…` | `UMAY_GULNUR_…` (kopya) | Biri silinsin |

---

## 4. İlk 10 Öncelik

| Sıra | İş | Etki | Süre |
|------|----|------|------|
| 1 | R1: parolaları repodan çıkar ve değiştir | Güvenlik | 1 saat |
| 2 | Tüm sahte veri panellerine DEMO rozeti | Güven | 1 gün |
| 3 | Supabase Auth + sunucu taraflı yetki (plan/rol) | Satış önkoşulu | 1 hafta |
| 4 | Stripe/Paddle abonelik (Pro plan) | İlk gelir | 1 hafta |
| 5 | 5 çekirdek paneli gerçek veriye bağla (izleme listesi, grafik, tarayıcı, temel analiz, haber) | Ürün değeri | 2–3 hafta |
| 6 | Vitest + CI test adımı | Kalite | 1 gün |
| 7 | Günlük 1 video + 3 Short üretim hattı (TR), AI etiketi ve yasal uyarı ile | Dağıtım | 2 hafta |
| 8 | Editoryal politika ve düzeltme sayfası yayında | Güven, uyum | 2 gün |
| 9 | EODHD ticari lisans teyidi + marka başvurusu | Hukuk | 2 hafta |
| 10 | Haftalık bülten (e-posta) + ücretsiz plan hunisi | Büyüme | 1 hafta |
