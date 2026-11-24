# 03 — YouTube Yayını ve Yayın Politikası

[← İçindekiler](./README.md)

> Platform kuralları sık değişir. Buradaki maddeler yazım tarihindeki (Kasım 2026) bilgiye dayanır;
> her biri uygulamadan önce YouTube Yardım Merkezi'nden teyit edilmelidir.

## 1. Stratejik Karar: 24/7 Döngü Yerine Programlı Yayın

Mevcut plan 24 saat kesintisiz, tamamen otomatik bir RTMP yayını öngörüyor. Bunu **ana strateji yapmayın**:

| 24/7 otomatik döngü | Programlı yayın (öneri) |
|---------------------|-------------------------|
| YouTube'un "özgün olmayan / tekrarlayan içerik" para kazanma kuralına takılma riski yüksek | Her video özgün metin + güncel veri = para kazanmaya uygun |
| İzleyici sayısı düşük, sunucu maliyeti sürekli | Maliyet yalnızca üretimde |
| İnsan onayı imkânsız → hatalı rakam yayınlanır | Her yayın editör onaylı |
| Arama trafiği üretmez | Her video kalıcı arama varlığı |
| Almanya'da doğrusal yayın = yayıncılık mevzuatı (bkz. §6.3) | İsteğe bağlı video daha hafif rejimde |

24/7 akış, kanal büyüdükten sonra **ikincil** bir "piyasa ekranı" olarak eklenebilir: canlı fiyat panosu +
takvim + sessiz müzik, sunucusuz, açıkça "otomatik veri ekranı" etiketli.

## 2. Kanal Mimarisi

| Aşama | Kanal | Gerekçe |
|-------|-------|--------|
| 0–6 ay | **Tek kanal, tek dil (Türkçe)** | Abone ve izlenme eşiğine en hızlı tek kanalda ulaşılır; çok dilli sesi YouTube'un çoklu ses parçası özelliğiyle ekleyin |
| 6–12 ay | + Almanca kanal | DACH reklam geliri ve terminal alıcısı daha değerli |
| 12 ay+ | + İngilizce kanal | Rekabet en yoğun; önce diğer ikisinde yöntem kanıtlansın |

12 kanal × 30 sunucu planı izlenmeyi 12'ye böler; hiçbir kanal para kazanma eşiğini geçemez.

## 3. Format Planı

| Format | Süre | Sıklık | Yapı | Amaç |
|--------|------|--------|------|------|
| **Sabah Bülteni** | 6–9 dk | Hafta içi 07:00 | Dün ne oldu (3 grafik) → bugün ne var (takvim) → izlenecek 3 seviye | Alışkanlık |
| **Veri Günü Flaş** | 2–4 dk | Enflasyon, faiz, istihdam günleri | Rakam → beklentiyle fark → piyasa tepkisi | Arama trafiği |
| **Haftalık Özet** | 12–18 dk | Cumartesi | Haftanın 5 grafiği + gelecek hafta | İzlenme süresi |
| **Terminal Dersi** | 8–12 dk | Haftada 1 | "Piotroski skoru nedir, terminalde nasıl bakılır" | **Ürün satışı** |
| **Shorts** | 30–45 sn | Günde 2–3 | Tek grafik, tek cümle, tek soru | Keşif |
| **Aylık Canlı Yayın** | 45–60 dk | Ayda 1 | İnsan sunuculu soru-cevap | Güven, üyelik |

"Terminal Dersi" en değerli formattır: kalıcı arama trafiği getirir ve her video ürünün canlı tanıtımıdır.

### Video iskeleti (sabah bülteni)

```
0:00  Kanca — günün en şaşırtıcı rakamı (tek cümle, tek grafik)
0:15  Kimlik — "NUR TV, AI ile üretilmiş piyasa bülteni" + yasal uyarı satırı
0:25  Bölüm 1 — Endeksler ve döviz
2:30  Bölüm 2 — Günün hikâyesi (tek konu, derin)
5:00  Bölüm 3 — Bugünün takvimi
6:30  Kapanış — "Bu grafikleri terminalde ücretsiz açın" + abone çağrısı
```

## 4. Yayın Öncesi Kontrol Listesi

- [ ] Tüm rakamlar kaynak anlık görüntüsüyle eşleşti (otomatik denetim geçti)
- [ ] Editör onayı kayıtlı
- [ ] YouTube Studio'da **"değiştirilmiş veya sentetik içerik"** beyanı işaretli
- [ ] Görüntüde "AI ile üretildi" rozeti, açıklamada AI ve yasal uyarı metni
- [ ] Başlık ≤ 60 karakter, rakam içeriyor, abartı yok
- [ ] Küçük resim: tek rakam + tek grafik, yanıltıcı ok/alev/şok ifadesi yok
- [ ] Bölümler (zaman damgaları), altyazı dosyası, sabit yorum (kaynak listesi)
- [ ] Sponsor varsa "ücretli tanıtım içerir" kutusu işaretli ve sözlü açıklama yapıldı
- [ ] Oynatma listesi, bitiş ekranı, terminal bağlantısı (UTM etiketli)

### Sabit açıklama metni (şablon)

```
Bu video yapay zekâ ile üretilmiş, yayın öncesinde bir editör tarafından denetlenmiştir.
İçerik genel bilgilendirme amaçlıdır; yatırım tavsiyesi değildir. Geçmiş performans
gelecekteki sonuçların göstergesi değildir. Veri kaynakları: […]. Düzeltmeler: […].
Künye / Impressum: […]
```

## 5. Büyüme ve SEO

| Kaldıraç | Uygulama |
|----------|----------|
| Arama niyeti | Başlıklar soruya cevap versin: "Fed faiz kararı ne oldu? (Kasım 2026)" |
| Seri mantığı | Her format kendi oynatma listesi; aynı saatte, aynı adla |
| İlk 15 saniye | Rakam önce, giriş animasyonu sonra |
| Shorts → uzun | Her Short'un ilgili uzun videoya bağlantısı |
| Topluluk sekmesi | Günlük anket ("Bugün dolar/TL hangi yönde?") |
| Çapraz dağıtım | Videonun metni blog yazısı olarak siteye (SEO), grafikleri X'e |
| Analitik ritmi | Haftalık: tıklama oranı, ortalama izlenme yüzdesi, ilk 30 sn tutma. Altı zayıf videodan sonra format değişir |

**Hedefler (gerçekçi, ilk 6 ay):**

| Ay | Abone | Aylık izlenme saati | Not |
|----|-------|---------------------|-----|
| 1 | 200 | 150 | Format oturtma |
| 3 | 1.000 | 1.200 | Hayran finansmanı eşiği |
| 6 | 4.000 | 4.000+ (12 ayda kümülatif) | Reklam geliri eşiği |

YouTube İş Ortağı Programı eşikleri: erken erişim 500 abone; reklam geliri 1.000 abone + son 12 ayda
4.000 saat (veya 90 günde 10 milyon Shorts görüntülemesi). Güncel eşikleri doğrulayın.

## 6. Yayın Politikası — Uyulması Gereken Kurallar

### 6.1 YouTube kuralları

| Kural | Sizin için anlamı |
|-------|-------------------|
| **Sentetik içerik beyanı** | Gerçekçi görünen AI sunucu/ses kullanan her videoda yükleme sırasında beyan zorunlu. Beyan edilmemesi videonun kaldırılmasına veya iş ortağı programından çıkarılmaya yol açabilir |
| **Özgün olmayan / tekrarlayan içerik** | Yalnızca şablon + otomatik ses ile seri üretilen, birbirinin benzeri videolar para kazanamaz. Çözüm: her videoda özgün analiz, güncel veri, editoryal seçim |
| **Yeniden kullanılan içerik** | Başkasının haber metnini/görüntüsünü seslendirmek yeterli dönüşüm sayılmaz |
| **Spam ve yanıltıcı uygulamalar** | Yanıltıcı başlık/küçük resim, sahte etkileşim, çok sayıda benzer kanal açmak yasak — 12 kanal planı bu açıdan da riskli |
| **Kimliğe bürünme** | Gerçek bir kişi/kurum gibi görünen AI sunucu olmaz; adlar ve yüzler gerçek kişilere benzememeli |
| **Reklamveren dostu içerik** | Savaş, felaket, cinsel çağrışımlı görseller reklamı kısıtlar. Sunucu görselleri profesyonel olmalı |
| **Finansal içerik** | "Garantili kazanç", hızlı zenginlik vaadi, pompalama içerikleri dolandırıcılık kuralları kapsamında kaldırılır |
| **Ücretli tanıtım** | Sponsor veya ortaklık (affiliate) bağlantısı varsa hem kutu hem sözlü açıklama |
| **Telif** | Müzik, haber görüntüsü, grafik: yalnızca lisanslı. Üç telif ihtarı = kanal kapanır |

### 6.2 Tarayıcı madenciliği ve yayın

"İşlem gücü karşılığı ücretsiz erişim" modeli yayınlarda tanıtılacaksa: açık rıza, anlık durdurma, tüketilen
güç bilgisi şart. Rızasız çalışan madenci, tarayıcılar ve reklam ağları tarafından kötü amaçlı yazılım
sayılır; alan adı kara listeye girerse YouTube bağlantılarınız da engellenir. Öneri: bu modeli yayınlarda
öne çıkarmayın.

### 6.3 Almanya / AB mevzuatı (doğrulayın)

| Konu | Kural | Uygulama |
|------|-------|----------|
| **Künye (Impressum)** | Ticari kanal ve site için zorunlu | Kanal "Hakkında" ve her açıklamada bağlantı; gerçek tüzel kişi ve sorumlu kişi adı |
| **Yayın lisansı** | Medienstaatsvertrag: doğrusal, programlı canlı yayın "Rundfunk" sayılabilir; ortalama eşzamanlı 20.000 kullanıcının altı lisanstan muaf | 24/7 akışı büyütmeden önce eyalet medya kurumuna danışın |
| **Reklam işaretleme** | Sponsorlu içerik açıkça "Werbung/Anzeige" | Görüntüde ve sözle |
| **Yatırım önerisi** | MAR md. 20: belirli araç hakkında öneri üreten/yayan, kimliğini, yöntemini ve çıkar çatışmasını açıklar | Bireysel hisse için al/sat/hedef fiyat vermeyin; verirseniz açıklama şablonu kullanın |
| **Lisanssız danışmanlık** | Kişiye özel yatırım tavsiyesi BaFin iznine tabi | Yorumlarda ve canlı yayında kişiye özel öneri verilmez |
| **AI şeffaflığı** | AB Yapay Zekâ Yasası md. 50: sentetik ses/görüntü işaretlenir (Ağustos 2026 itibarıyla) | Rozet + açıklama + meta veri |
| **GDPR** | Canlı sohbet, bülten kaydı, analitik | Açık rıza, gizlilik bildirimi |
| **Türkiye** | SPK: yatırım danışmanlığı yetki belgesine tabi; izleyicilere yönelik yorumlarda zorunlu uyarı metni | Türkçe içerikte SPK uyarı metni kullanın |

### 6.4 İç yayın politikası (şirket kuralı olarak benimseyin)

1. Onaysız yayın yok — otomasyon taslak üretir, insan yayınlar.
2. Her içerikte AI etiketi ve yasal uyarı.
3. Bireysel hisse için al/sat çağrısı ve fiyat hedefi yok.
4. Sponsor, içerik kararını etkileyemez; kripto borsası, kaldıraçlı ürün, bahis sponsorluğu alınmaz.
5. Yorum moderasyonu: dolandırıcılık bağlantıları ve "sinyal grubu" reklamları otomatik gizlenir;
   kanal adına WhatsApp/Telegram'dan kimseye özel mesaj atılmadığı sabit yorumda yazılır.
6. Kriz protokolü: piyasa çöküşü, savaş, şirket iflası → sansasyonel dil yok, yalnızca doğrulanmış veri.
7. Hata protokolü: bkz. [02-medya-haber.md §B4](./02-medya-haber.md) madde 6.
8. Hesap güvenliği: marka hesabı, donanım anahtarlı iki aşamalı doğrulama, yayın anahtarı yalnızca gizli
   değişkende (repoda veya arayüz ayarında düz metin olarak saklanmaz).