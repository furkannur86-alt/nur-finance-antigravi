# NUR Finance — HeyGen Video Production Guide

## Step 1: Go to HeyGen
Open https://app.heygen.com — sign up free (no credit card needed for first video)

## Step 2: Create New Video
- Click "Create Video" → "AI Avatar"
- Choose avatar: Select a professional female/male business avatar
- Background: Upload a screenshot of NUR Finance terminal (take from localhost:3000)

## Step 3: Paste These Scripts

### VIDEO 1: English — Full Terminal Tour (60 seconds)

```
Welcome to NUR Finance Terminal — the institutional-grade financial platform 
commanding Eastern and Western markets.

Let me walk you through our professional terminal.

Starting with the Dashboard — your command center. Real-time portfolio tracking, 
live market data from EODHD, interactive 3D globe showing global market activity, 
and risk monitoring — all in one view.

Moving to Global Markets. Access indices, stocks, commodities, forex, and crypto 
across 70 exchanges in 60 countries. Every data point is live.

Our Financial Media hub delivers Reuters and Bloomberg quality news with AI-powered 
sentiment analysis. Click any headline and hear it read aloud with our Neural HD 
voice engine.

The Live Broadcast section features multi-language financial TV. Select English, 
German, Turkish, Arabic, Chinese, or Japanese — each with Neural HD voice narration.

For analysis, our Macro Risk Monitor tracks 10 risk factors in real time. 
VIX regime, portfolio risk score, drawdown exposure — institutional-grade analytics 
at your fingertips.

NUR Finance. Three tiers: Retail at 29 euros, Professional at 199, 
Institutional at 999 per month. No invitation needed. Instant checkout.

NUR Finance — Commanding Eastern and Western Markets.
```

### VIDEO 2: German — Frankfurt Desk (45 seconds)

```
Willkommen beim NUR Finance Terminal — die institutionelle Finanzplattform 
fuer oestliche und westliche Maerkte.

Unser professionelles Terminal bietet Echtzeit-Marktdaten von ueber 70 Boersen 
in 60 Laendern. DAX, Euro Stoxx, Bundesanleihen — alles in einer Ansicht.

Das Financial Media Center liefert Nachrichten in Bloomberg-Qualitaet mit 
KI-gestuetzter Sentiment-Analyse. Jede Schlagzeile kann mit unserer 
Neural HD Stimme vorgelesen werden.

Der Live-Broadcast bietet mehrsprachiges Finanz-TV. Waehlen Sie Deutsch, 
Englisch, Tuerkisch oder weitere Sprachen — jeweils mit neuronaler Sprachausgabe.

Unser Makro-Risiko-Monitor ueberwacht 10 Risikofaktoren in Echtzeit. 
VIX-Regime, Portfolio-Risikobewertung, Drawdown-Exposure — institutionelle 
Analytik auf hoechstem Niveau.

NUR Finance. Drei Stufen: Retail ab 29 Euro, Professional 199 Euro, 
Institutional ab 999 Euro monatlich.

NUR Finance — Commanding Eastern and Western Markets.
```

### VIDEO 3: Turkish — Istanbul Desk (45 seconds)

```
NUR Finance Terminal'e hos geldiniz. Dogu ve Bati piyasalarini yoneten 
kurumsal finansal platform.

Profesyonel terminalimiz 60'tan fazla ulkede 70'ten fazla borsadan 
canli piyasa verisi sunar. BIST 100, altin, doviz — hepsi tek ekranda.

Finansal Medya merkezimiz Reuters ve Bloomberg kalitesinde haberler sunar. 
Yapay zeka destekli duygu analizi ile her haber basligini sesli dinleyebilirsiniz.

Canli Yayin bolumumuz cok dilli finansal TV sunar. Turkce, Ingilizce, 
Almanca, Arapca — her biri Neural HD ses teknolojisi ile.

Makro Risk Monitoru 10 risk faktorunu anlik izler. VIX rejimi, 
portfoy risk skoru, zarar maruziyeti — kurumsal seviye analitik.

NUR Finance. Uc kademe: Retail aylik 29 Euro, Profesyonel 199 Euro, 
Kurumsal 999 Euro. Davetiye gerekmez. Aninda abone olun.

NUR Finance — Dogu ve Bati Piyasalarini Yonetmek.
```

## Step 4: Terminal Screenshots for Background

Take these screenshots from your running terminal (localhost:3000):

1. **Dashboard view** — Shows globe, portfolio, market pulse
2. **Global Markets** — Shows stock table with bull/bear icons
3. **Media > News Wire** — Shows news feed with LISTEN buttons
4. **Media > Live Broadcast** — Shows broadcast controls with language selector
5. **Macro Risk** — Shows risk gauges and VaR metrics

## Step 5: Export & Upload

- Export from HeyGen as MP4 (1080p)
- Upload to YouTube as:
  - "NUR Finance Terminal — Full Tour" (English)
  - "NUR Finance Terminal — Frankfurt Desk" (German)  
  - "NUR Finance Terminal — Istanbul" (Turkish)

## Alternative: ElevenLabs Voice-Only

If you prefer to add voice to existing screen recordings:

1. Go to https://elevenlabs.io
2. Paste the script above
3. Select voice: "Rachel" (English), "Nicole" (German)
4. Download MP3
5. Merge with screen recording using any video editor (CapCut, DaVinci Resolve free)

## Alternative: Use Terminal's Built-in TTS

Once deployed to Vercel/production, the terminal's /api/ai/tts endpoint 
will work because production has internet access to Microsoft Neural servers.

Test it: Open Media > Live Broadcast > Click "START BROADCAST"
Each news item also has a LISTEN button for voice narration.
