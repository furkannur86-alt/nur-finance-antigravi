# 04 — Gelir Modelleri, Genel Fikirler ve Yol Haritası

[← İçindekiler](./README.md)

> Bu bölümdeki tüm rakamlar **planlama varsayımıdır**, ölçülmüş veri değildir. İlk 90 günün amacı bu
> varsayımları gerçek rakamlarla değiştirmektir.

## 1. Gelir Mantığı

```
YouTube / Shorts / X  →  Ücretsiz terminal hesabı  →  E-posta bülteni  →  Pro abonelik  →  Quant / Ekip
     (erişim)               (ürünü deneme)            (ilişki)           (ana gelir)      (yüksek gelir)
```

Medya **müşteri edinme maliyetini düşüren kanal**, terminal **gelir üreten ürün**. Reklam geliri ikincil;
asıl hedef izleyiciyi aboneye çevirmek.

## 2. Fiyatlandırma Önerisi

| Plan | Fiyat (aylık) | Kim için | İçerik |
|------|---------------|----------|--------|
| **Free** | €0 | Meraklı izleyici | Gecikmeli veri, 1 izleme listesi, 5 panel, günlük brifing |
| **Pro** | €19–29 | Bireysel yatırımcı | Tüm analiz panelleri, sınırsız liste, uyarılar, kişisel sabah brifingi, CSV dışa aktarma |
| **Quant** | €79–149 | Yarı-profesyonel, serbest analist | Geri test, tarayıcı API'si, opsiyon akışı, risk panosu, veri indirme kotası |
| **Team** | €299+ / 5 koltuk | Küçük fon, aile ofisi, danışman | Paylaşılan çalışma alanı, denetim kaydı, öncelikli destek |
| **NUR Finance R / B** | ~€100K / yıl | Kurumsal | `CLAUDE.md` erişim kuralları aynen geçerli (Reuters / Bloomberg geçmişi, B için davet) |

**R ve B hakkında dürüst değerlendirme:** kurallar değişmez ve ürün ailesinde yer almalıdır; ancak yılda
€100K ödeyen bir kurum gerçek zamanlı borsa lisansı, hizmet seviyesi sözleşmesi, güvenlik denetimi (SOC 2 /
ISO 27001) ve 7/24 destek bekler. Bunlar bugün yok. Öneri: R/B'yi **"davetle, bekleme listesi"** olarak
sergileyin (prestij ve çıpa fiyat etkisi), nakit akışını Pro/Quant'tan kurun, kurumsal önkoşulları 12–24
ayda tamamlayın. Yıllık ödemede 2 ay ücretsiz; öğrenci indirimi; 14 gün cayma hakkı (AB tüketici hukuku).

## 3. Gelir Akışları — Öncelik Sırasıyla

| # | Akış | Ne zaman | Çaba | Not |
|---|------|----------|------|-----|
| 1 | **Pro / Quant abonelik** | Ay 1–2 | Yüksek | Ana gelir. Stripe/Paddle (Paddle "kayıtlı satıcı" olarak AB KDV'sini üstlenir) |
| 2 | **Ücretli bülten / premium brifing** | Ay 2 | Düşük | Terminali kullanmayan izleyici için €5–9 |
| 3 | **YouTube reklam geliri** | Ay 4–6 (eşik sonrası) | — | Finans, reklam getirisi en yüksek kategorilerden; yine de ilk yıl küçük kalır |
| 4 | **Kanal üyelikleri / Süper Teşekkür** | 500 abone sonrası | Düşük | Üyelere özel haftalık derin analiz |
| 5 | **Sponsorluk** | 5–10 bin abone | Orta | Yalnızca uyumlu markalar (veri sağlayıcı, muhasebe yazılımı, eğitim). Açıkça işaretli |
| 6 | **Ortaklık (affiliate)** | Ay 3+ | Düşük | Lisanslı aracı kurum, kitap, yazılım. Her bağlantı açıklamalı. Kaldıraçlı ürün ve lisanssız borsa yok |
| 7 | **Eğitim ürünleri** | Ay 4+ | Orta | "Terminal ile temel analiz" kursu (€99–199), tek seferlik. Mevcut 10 kurs içeriği yeniden paketlenebilir |
| 8 | **API / veri ürünü** | Ay 6+ | Orta | Yalnızca **kendi ürettiğiniz** veri (skorlar, sinyaller); sağlayıcı verisini yeniden satmayın |
| 9 | **Beyaz etiket / B2B** | Ay 9+ | Yüksek | Finans blogları ve danışmanlar için gömülebilir grafik ve tarayıcı bileşeni |
| 10 | **Medya üretim hizmeti** | Ay 6+ | Orta | Üretim hattını KOBİ'lere "AI kurumsal bülten" olarak satmak (NUR AI Studio fikrinin uygulanabilir hâli) |
| 11 | **Kurumsal R / B** | Ay 12–24 | Çok yüksek | Önkoşullar tamamlanınca |

### Önerilmeyen gelir yolları

| Fikir | Neden hayır |
|-------|-------------|
| Kendi stablecoin'i / $NUR satışı | Lisans yükü, yatırımcı zararı riski, banka ve ödeme sağlayıcılarının hesabı kapatma riski |
| Tarayıcı madenciliği | Kullanıcı başına getirisi kuruş düzeyinde; itibar ve kara liste maliyeti yüksek |
| Bahis hunisi | Lisans ve reklam yasağı; finans markasına zarar |
| Gizli AI influencer ağı | Platformdan kalıcı uzaklaştırma riski tüm dağıtım kanalını yok eder |
| Sinyal / "al-sat" abonelik grubu | Lisanssız yatırım danışmanlığı sayılabilir |

## 4. Birim Ekonomisi (varsayım tablosu — ölçülerek güncellenecek)

| Gösterge | Varsayım | Ölçüm yöntemi |
|----------|----------|---------------|
| Video izleyici → site ziyareti | %1–2 | UTM etiketli bağlantılar |
| Ziyaret → ücretsiz kayıt | %8–12 | Huni analitiği |
| Ücretsiz → Pro (90 günde) | %2–4 | Kohort tablosu |
| Aylık kayıp (Pro) | %5–7 | Abonelik verisi |
| Kullanıcı başına veri + altyapı maliyeti | < gelirin %20'si | Fatura / aktif kullanıcı |

Örnek okuma: ayda 100.000 izlenme → ~1.500 ziyaret → ~150 kayıt → ~5 yeni Pro abone. Bu, medyanın tek başına
yetmeyeceğini, **SEO (blog + terminal dersi videoları) ve e-posta** ile desteklenmesi gerektiğini gösterir.

**İlk gelir hedefi:** 12 ayda 300 Pro + 30 Quant abone ≈ aylık €9–12 bin yinelenen gelir. Bu eşik, tam
zamanlı bir editör ve ticari veri lisansını karşılar.

## 5. Genel Fikirler

### 5.1 Üründe farklılaşma — rakiplerin zayıf olduğu yerler

| Fikir | Neden değerli |
|-------|---------------|
| **Türkçe ve Almanca tam yerelleştirilmiş terminal** (BIST + XETRA + ABD tek ekranda) | Koyfin, TradingView, Finviz bu kitleye yerel dilde derin temel analiz sunmuyor |
| **"Açıklanabilir skor"**: Piotroski/Altman/Beneish'in her bileşeni tıklanınca hangi bilanço kaleminden geldiğini gösterir | Kara kutu skorlar güven vermez; şeffaflık markadır |
| **Kişisel sabah brifingi** | Günlük alışkanlık = düşük abonelik kaybı |
| **Video ↔ terminal bağlantısı**: videodaki her grafik terminalde tek tıkla açılır | Medyayı doğrudan ürüne bağlar; rakiplerde yok |
| **Portföy sağlık raporu (PDF)**: risk, yoğunlaşma, senaryo testi | Paylaşılabilir çıktı = organik tanıtım |
| **Doğal dil sorgusu**: "F/K'sı 15'in altında, temettüsü %3'ün üstünde DAX hisseleri" → tarayıcı filtresi | LLM'in en güvenli kullanımı: sorgu çevirisi, rakam üretimi değil |
| **Katılım finans (faizsiz) süzgeci** | Türkiye, Körfez ve Avrupa'daki Müslüman yatırımcılar için net, az hizmet alan niş |

### 5.2 AI kullanım ilkeleri

- LLM **rakam üretmez**; yalnızca doğrulanmış veriyi özetler, çevirir, sorguya dönüştürür.
- Her AI çıktısında kaynak bağlantısı ve "AI özeti" etiketi.
- `/api/ai/analyze` gerçek modele bağlanırken: istem enjeksiyonuna karşı haber metni "veri" olarak işaretlenir,
  kullanıcı başına kota, yanıt önbelleği, maliyet takibi.

### 5.3 Topluluk ve güven

- Kamuya açık yol haritası ve değişiklik günlüğü; kullanıcı oylamasıyla özellik önceliği.
- Aylık "şeffaflık notu": abone sayısı, hatalar, düzeltmeler, veri kaynakları.
- Kurucunun yüzü: AI sunucuların yanında ayda bir **gerçek insan** canlı yayını. Finans ürününde arkasında
  gerçek, adı bilinen bir sorumlu olması satın alma kararının ön koşuludur; "anonim, sahipsiz ağ"
  anlatısı bu güveni zedeler ve Impressum zorunluluğuyla çelişir.

### 5.4 Şirket ve marka

- Tek tüzel kişi (GmbH kuruluşu tamamlanmalı), tek alan adı, tek marka mimarisi: **NUR Finance** (terminal),
  **NUR TV** (medya). Diğer alt markalar (Game, Dating, Legacy, GhostVault, Comm Pro, Tatar Finans)
  askıya alınsın.
- Marka tescili: EUIPO + TÜRKPATENT (sınıf 9, 36, 38, 41, 42).
- "2126", "egemen", "galaktik filo" anlatısı eğlenceli bir kimlik öğesi olabilir; ancak fiyat sayfası,
  hukuki sayfalar ve terminalin ana ekranı sade ve kurumsal olmalı.

## 6. 90 Günlük Plan

| Dönem | Ürün | Medya | İş / Hukuk |
|-------|------|-------|------------|
| **Gün 1–14** | Parolaları kaldır; DEMO rozetleri; Auth; panel kayıt defteri; Vitest + CI | Karakter kartları (3 sunucu); video şablonu; editoryal politika sayfası | Tüzel kişi + Impressum; EODHD lisans sorusu; marka başvurusu |
| **Gün 15–30** | 5 çekirdek panel gerçek veride; Stripe/Paddle; Free + Pro yayında | Sabah bülteni günlük (TR); günde 2 Short | AGB, Datenschutz, Widerruf gözden geçirme; KDV kaydı |
| **Gün 31–60** | Uyarılar, kişisel brifing, temel analiz + skorlar gerçek veride; yetki tablosu + B/R testleri | + Terminal Dersi (haftalık), haftalık özet; e-posta bülteni | İlk 20 ücretli kullanıcıyla görüşme |
| **Gün 61–90** | Quant planı (geri test, tarayıcı API'si); performans ve hata izleme | + Almanca ses parçası; ilk insanlı canlı yayın | Fiyat testi; ortaklık anlaşmaları; R/B bekleme listesi |

**Durdurma kuralı:** 90. günde 1.000 abone ve 25 ücretli kullanıcıya ulaşılmadıysa yeni özellik eklemeyin;
format ve konumlandırmayı değiştirin.

## 7. KPI Panosu

| Alan | Gösterge | 90 gün hedefi |
|------|----------|---------------|
| Erişim | YouTube abone / aylık izlenme saati | 1.000 / 1.200 |
| Erişim | E-posta abonesi | 1.500 |
| Ürün | Haftalık aktif kullanıcı | 400 |
| Ürün | 30. gün elde tutma (ücretsiz) | %25 |
| Gelir | Ücretli abone / aylık yinelenen gelir | 25 / €600 |
| Kalite | Yayın hata oranı / panel çökme oranı | < %0,5 / < %0,1 |
| Uyum | AI beyanı ve yasal uyarı içeren içerik oranı | %100 |