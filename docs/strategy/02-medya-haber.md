# 02 — Medya ve Haber Önerileri

[← İçindekiler](./README.md)

## BÖLÜM A — MEDYA

### A1. Konumlandırma

**Önerilen marka cümlesi:** "NUR TV — yapay zekâ ile üretilen, insan editör tarafından denetlenen günlük
piyasa yayını."

AI üretimini gizlemek yerine **ürün özelliği** yapın. Gizlenen AI ortaya çıktığında güven biter; açıkça
söylenen AI ise "her sabah 07:00'de, 3 dilde, veriyle" vaadinin kanıtıdır. Bu aynı zamanda platform
kurallarının ve AB şeffaflık yükümlülüklerinin gereğidir (bkz. [03-youtube.md §6](./03-youtube.md)).

### A2. Karakter sistemi — 1.125 yerine 8

| Mevcut plan | Sorun | Öneri |
|-------------|-------|-------|
| 75 şehir × 15 = 1.125 karakter | Üretilemez, yönetilemez, izleyici bağ kuramaz | Dil başına 2 ana sunucu + 2 uzman = **en fazla 8** |
| Uydurma "prestijli üniversite doktorası" | Yanıltıcı beyan | Unvan yok. Künye: "AI sunucu · NUR Finance" |
| Fiziksel ölçü tarifleri (boy, beden, dekolte) | Reklamveren ve itibar riski, cinsiyetçi algı | Tek kıyafet standardı: koyu takım, sade arka plan, erkek ve kadın sunucuda aynı ölçüt |
| Platform başına gerçek kişi gibi hesap | Kimliğe bürünme/sahte hesap kuralları | Hesap adlarında ve profilde "AI" ibaresi; tüm hesaplar marka hesabına bağlı |
| İki farklı göz rengi kodu | Tutarsızlık | Tek marka rengi seçilsin; ayırt edici imza olarak korunabilir |

**Önerilen kadro (ilk aşama):**

| Rol | Dil | Format |
|-----|-----|--------|
| Ana sunucu 1 | Türkçe | Sabah bülteni, haftalık özet |
| Ana sunucu 2 | Almanca | Sabah bülteni (DACH) |
| Ana sunucu 3 | İngilizce | Küresel kapanış |
| Makro uzmanı | TR/EN | Merkez bankası ve veri günleri |
| Kuant uzmanı | TR/EN | Terminal eğitimleri, strateji testleri |

Her karakter için tek sayfalık **karakter kartı**: ad, rol, ses (TTS modeli + hız), görsel referans seti,
konuşma üslubu, yasak ifadeler ("garanti", "kesin kazanç", "hemen al").

### A3. Üretim hattı

```
06:00  Veri çekimi (kapanışlar, vadeliler, takvim, haber başlıkları)
06:10  Taslak metin (LLM) — yalnızca doğrulanmış veri alanlarından
06:20  Otomatik denetim: rakam ↔ kaynak eşleşmesi, yasak ifade taraması
06:30  İNSAN ONAYI (editör) — onaysız yayın yok
06:40  TTS + görsel bileşim (FFmpeg): grafikler, alt bant, AI rozeti
06:55  Küçük resim + başlık + açıklama + bölümler
07:00  Yayın: YouTube (uzun) → 3 Short → X / LinkedIn / Telegram özeti
```

| Bileşen | Mevcut | Öneri |
|---------|--------|-------|
| TTS | `core_engine/tts_engine.py` (Piper → Google → edge → espeak) | Kalsın; ticari kullanım koşulu net olan tek birincil motor seçin (edge-tts'in ticari kullanım hakkı belirsiz — doğrulayın) |
| Video | `broadcast_composer.py`, `videoRenderer.ts` | Tek hat seçin (Python **veya** TS). Şablon tabanlı, 1080p30 yeterli; 60 fps maliyeti artırır, değer katmaz |
| Avatar | Mikro-hareket animasyonu, HeyGen hazır | Başlangıçta **sunucu görüntüsü küçük köşe karesi**, ekranın %80'i veri ve grafik. İzleyici grafik için gelir |
| Altyazı | Yok | Zorunlu: gömülü + SRT yükleme (erişilebilirlik, sessiz izleme, SEO) |
| Müzik/görsel | Belirsiz | Yalnızca lisanslı veya kendi üretimi; lisans kaydı tablosu tutun |
| Arşiv | Yok | Her yayın için: metin, veri anlık görüntüsü, onaylayan kişi, zaman — 5 yıl saklama |

### A4. Görsel kimlik

- Tek şablon ailesi: açılış (3 sn), ana ekran, alt bant, kapanış (kanala abone + terminal çağrısı).
- Her karede köşe rozeti: **"AI ile üretildi"**.
- Renk: terminal paletiyle aynı (`#0a0c10`, `#00c8ff`, `#f59e0b`) — yayın ile ürün aynı marka görünsün.
- Grafiklerde her zaman: eksen, birim, kaynak, tarih. Kaynaksız grafik yayınlanmaz.

### A5. Dağıtım matrisi

| Kanal | İçerik | Sıklık | Amaç |
|-------|--------|--------|------|
| YouTube (uzun) | Sabah bülteni 6–9 dk | Hafta içi her gün | Arama + abone |
| YouTube Shorts | Tek grafik, tek fikir, 30–45 sn | Günde 2–3 | Keşif |
| X | Grafik + 2 cümle, veri günü canlı akışı | Günde 5–8 | Profesyonel kitle |
| LinkedIn | Haftalık makro özeti, ürün güncellemesi | Haftada 2–3 | B2B, DACH |
| Telegram / WhatsApp kanalı | Sabah 5 madde | Günde 1 | Sadık kitle |
| E-posta bülteni | Haftalık özet + terminal ipucu | Haftada 1 | **Sahip olunan kitle** — en değerli varlık |
| TikTok / Instagram | Shorts'un yeniden kullanımı | Günde 1 | Düşük öncelik |

---

## BÖLÜM B — HABER

### B1. Haber masasının işlevi

İki ayrı ürün, iki ayrı kural seti:

| | Terminal içi haber akışı | Yayın/yayınlanan haber |
|---|--------------------------|------------------------|
| Amaç | Hız, kapsam | Doğruluk, yorum |
| İçerik | Başlık + kaynağa bağlantı + sembol etiketi | Kendi yazdığınız özet ve analiz |
| Telif | Yalnızca başlık/özet + bağlantı; tam metin kopyalanmaz | Özgün metin; alıntı kısa ve kaynaklı |
| Onay | Otomatik (kaynak beyaz listesi) | İnsan editör |

### B2. Kaynak hiyerarşisi

1. **Birincil**: merkez bankaları (Fed, ECB, TCMB), istatistik kurumları, şirket bildirimleri (SEC EDGAR, KAP,
   Bundesanzeiger), borsa duyuruları. Ücretsiz, telifsiz kullanılabilir, en güvenilir.
2. **Lisanslı**: sözleşmeli haber akışı (EODHD News koşulları teyit edilmeli — yeniden yayın hakkı var mı?).
3. **İkincil**: basın (Reuters, Bloomberg, FT…) — yalnızca atıf ve bağlantı; metin ve görsel kopyalanmaz.
4. **Kullanılmaz**: anonim sosyal medya iddiaları (yalnızca "doğrulanmamış" etiketiyle ve ikinci kaynakla).

Rakip markaları (Bloomberg, Reuters) haber kaynağı olarak anmak serbesttir; kendi ürününüzü onların adıyla
pazarlamak ("Bloomberg-tier") marka hukuku açısından risklidir — "kurumsal sınıf terminal" deyin.

### B3. Ürün özellikleri (terminal haber modülü)

| Özellik | Açıklama | Plan |
|---------|----------|------|
| Sembol eşleme | Her haber ilgili hisse/varlıkla etiketlenir; izleme listesine göre süzülür | Ücretsiz |
| Önem puanı | Kaynak güvenilirliği × piyasa tepkisi × yenilik | Pro |
| AI özeti (3 madde) | Kaynağa bağlantılı, "AI özeti" etiketli | Pro |
| Ekonomik takvim | Beklenti / gerçekleşen / sürpriz, sesli uyarı | Ücretsiz (gecikmeli) / Pro (anlık) |
| Bilanço takvimi | İzleme listesindeki şirketler için uyarı | Pro |
| Sabah brifingi (kişisel) | Kullanıcının portföyüne göre 5 madde, e-posta | Pro — **en güçlü elde tutma özelliği** |
| Haber → fiyat tepkisi | Haber anından sonraki 1s/1g/5g getiri | Quant |
| Çok dilli çeviri | TR/DE/EN | Pro |

### B4. Editoryal politika (yayınlanması gereken kamuya açık sayfa)

1. **Doğruluk**: her rakam bir kaynağa ve zaman damgasına bağlıdır; kaynak gösterilemeyen rakam yayınlanmaz.
2. **AI şeffaflığı**: metin, ses ve görüntünün AI ile üretildiği her içerikte belirtilir; yayın öncesi bir
   insan editör onaylar; sorumlu editörün adı künyede yer alır.
3. **Haber ile yorum ayrımı**: yorum içerikleri "Analiz" / "Görüş" etiketlidir.
4. **Yatırım tavsiyesi değildir**: içerikler genel bilgilendirmedir; kişiye özel al/sat önerisi verilmez.
   Belirli bir varlık hakkında yön bildiren içerik, AB'de "yatırım önerisi" sayılabilir (MAR md. 20) ve
   kaynak, yöntem, çıkar çatışması açıklaması gerektirir — doğrulayın.
5. **Çıkar çatışması**: şirketin veya editörün pozisyon taşıdığı varlıklar içerikte açıklanır. Sponsorlu
   içerik baştan ve açıkça "Reklam / Anzeige" olarak işaretlenir.
6. **Düzeltme**: hata 24 saat içinde düzeltilir; video açıklamasına ve sabit yoruma düzeltme notu, ciddi
   hatada videonun yeniden yayını. Kamuya açık düzeltme günlüğü tutulur.
7. **Yasaklı içerik**: fiyat hedefi garantisi, "kesin", "risksiz", pompalama, tek hisseye yönlendirme,
   doğrulanmamış söylenti, kişilere yönelik itham.
8. **Hassas dönemler**: savaş, afet, iflas haberlerinde sansasyonel başlık ve küçük resim kullanılmaz.
9. **Telif**: üçüncü taraf metin, görüntü ve müzik yalnızca lisansla; lisans kaydı arşivlenir.
10. **Geri bildirim**: düzeltme talepleri için görünür bir iletişim adresi.

### B5. Haber KPI'ları

| Gösterge | Hedef |
|----------|-------|
| Yayınlanan rakamlarda hata oranı | < %0,5 |
| Düzeltme süresi | < 24 saat |
| Veri açıklaması → terminal akışı gecikmesi | < 60 sn |
| Veri açıklaması → Short yayını | < 30 dk |
| Sabah brifingi açılma oranı | > %45 |
