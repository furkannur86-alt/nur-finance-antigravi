# NUR FINANCE — 2126 QUANTUM TRADING & GLOBAL MEDIA NETWORK
## Prodüksiyon Dağıtım, YouTube 24/7 Canlı Yayın & Yönetim Kılavuzu

---

### 🌐 1. `nurfinans.com` Domain & Sunucu Canlıya Alma

#### Seçenek A: Vercel ile 1 Tıkla Dağıtım (Önerilen)
1. GitHub reponuzu (`furkannur86-alt/nur-finance-antigravi`) Vercel hesabınıza bağlayın.
2. **Framework Preset:** Next.js
3. **Build Command:** `npm run build`
4. **Custom Domain:** `nurfinans.com` ve `www.nurfinans.com` alan adlarınızı ekleyin.
5. Cloudflare veya Namecheap DNS ayarlarınıza Vercel A/CNAME kayıtlarını girin.

#### Seçenek B: Docker ile Bağımsız Sunucu (VPS / AWS / DigitalOcean)
```bash
# Docker imajını derleyin ve başlatın
docker-compose up -d --build
```

---

### 📺 2. 24/7 YouTube Live Yayını Başlatma

1. **YouTube Studio** > **Canlı Yayın Oluştur** paneline gidin.
2. **Yayın Anahtarınızı (Stream Key)** kopyalayın.
3. İki yöntemle yayına başlayabilirsiniz:
   - **Yöntem 1 (Arayüz Üzerinden):** Nur Finans `Studio` sekmesine girip `📺 YouTube RTMP Ayarları` butonuna tıklayın ve anahtarınızı yapıştırın.
   - **Yöntem 2 (OBS Studio ile 7/24 Kesintisiz):** OBS üzerinde Yayın servisi olarak `YouTube - RTMPS` seçin ve yayın anahtarınızı girin.

---

### 🔑 3. Egemen Yönetici Kasası (Sovereign Vault) Kullanımı

* **Giriş Yolları:**
  * Klavyeden: `Ctrl + Shift + S`
  * Çift Başlı Kartal Logosuna: `3 Kez Art Arda Tıklama`
  * Kuantum Ticker Rozeti: `🔒 STEALTH` butonuna tıklama
* **Geçiş Kodları:** `2126` veya `NUR-SOVEREIGN-2126` veya `UMAY-2126`
* **Açılan Yönetici Modülleri:**
  * 👑 **Umay Gül Nur Boss Terminali**
  * 🏛️ **7 Büyüme Kolu (Holding Ekosistemi)**
  * 🎲 **Tatar Finans (Risk & Kasa Gelir Havuzu)**

---

### 💳 4. Kripto Cüzdan Adreslerinizi Güncelleme

Cüzdan adreslerinizi değiştirmek istediğinizde `src/components/trading/DigitalWalletGateway.tsx` dosyasındaki `SUPPORTED_NETWORKS` listesine kendi Polygon, Arbitrum, Ethereum veya TRON adreslerinizi yazmanız yeterlidir.

---

### 🛡️ 5. Güvenlik & Gizlilik
* Sistem sıfır kişisel veri (Zero-PII) prensibiyle çalışır.
* Tüm harici ziyaretçiler için yalnızca kurumsal düzeyde kuantum borsa ve jeopolitik istihbarat platformu görünür.
