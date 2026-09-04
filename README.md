# NUR Finance AntiGravi IDE

Bloomberg/Reuters-tier financial terminal built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- **22+ API-Connected Panels** — Dashboard, Portfolio, Charts, Backtest, Global Markets, Economic Data, Screener, Options, AI Tools, MacroRisk, OMS/EMS, Quant Copilot, Broadcast Studio, VIP Verify, and more
- **Institutional OMS / EMS** — Direct Market Access L2 Depth of Market ladder, algorithmic smart order types (TWAP, VWAP, Iceberg), Kelly margin sizing, and execution audit logging
- **AI Quant Copilot & WISH Engine** — WISH Framework matrix (Worldview, Indicators, Setup Gatekeeping, Discipline), autonomous long/short pair trade generator, and macro stress tests
- **Real-Time HUD Alert Center** — Price, VIX regime shift, ACLED conflict proximity, and macro surprise evaluation with synthesized Web Audio chimes
- **Interactive Broadcast Studio** — 12-language AI newsroom with 30 AI Anchors, real-time teleprompter, breaking banner injector, and canvas audio spectrum visualizer
- **NUR Finance B & R VIP Verification** — Institutional compliance portal enforcing 1-year Reuters / Bloomberg history and handpicked VIP leadership invitations per non-negotiable business rules
- **MacroRisk Engine & Kill Switch** — 10 macroeconomic risk indicators, scenario matrix, dynamic double-headed Eagle Crest, and emergency portfolio liquidation
- **Real-Time Market Data** — Equities, forex, commodities, crypto, and indices across 60+ global exchanges
- **NUR Terminal** — Bloomberg/Reuters-tier command-line interface for power users
- **Code Editor** — Integrated quantitative finance development environment with backtesting

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.3.3 (Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| State | Zustand |
| Database | Supabase (PostgreSQL) |
| Market Data | EODHD API |
| Economic Data | FRED API |
| Media | Pillow, ffmpeg |

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for all required variables. At minimum you need:

- `EODHD_API_TOKEN` — Market data from [EODHD](https://eodhd.com/)
- `FRED_API_KEY` — Economic data from [FRED](https://fred.stlouisfed.org/)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Database

## Project Structure

```
src/
├── app/           # Next.js routes and API endpoints
├── components/    # React components (layout, panels, editors)
├── lib/           # Market data clients, utilities
└── stores/        # Zustand state management
```

## License

Proprietary — NUR Finance GmbH (i.Gr.)
