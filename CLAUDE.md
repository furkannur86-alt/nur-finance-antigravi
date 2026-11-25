@AGENTS.md

# NUR Finance AntiGravi — Project Rules

## Company Identity

NUR Finance is a **financial data, analytics, and media company**. We sell financial information, real-time market data, trading tools, risk analytics, and financial media content. Every feature, panel, and product must serve this mission. Nothing else belongs in this platform.

## Terminal Tiers

NUR Finance offers three terminal products:

### Retail Terminal
- **Target**: Individual traders, retail investors, finance students, independent analysts
- **Pricing**: Free (limited) / €29–€49 per month (full)
- **Features**: 15-min delayed or standard data feeds, up to 3 concurrent dock panels, watchlists, news feed, basic charts, portfolio tracker
- **Prerequisites**: None. Instant signup with credit card or free account.

### Professional Terminal
- **Target**: Professional traders, analysts, portfolio managers — including those already using Bloomberg or Reuters who want a complementary tool
- **Pricing**: €199 per month
- **Features**: Real-time Level 1 & Level 2 data, interactive 60 FPS charts, full options chain with Greeks, quick DMA execution ticket, macro risk & VaR modeling, unlimited custom layouts, all analysis panels
- **Prerequisites**: None. Instant checkout.

### Institutional Terminal
- **Target**: Banks, investment banks, hedge funds, asset managers, sovereign wealth funds, political parties, government agencies
- **Pricing**: €999+ per month (bespoke enterprise pricing)
- **Features**: Everything in Professional, plus multi-seat team administration, FIX Protocol DMA, compliance audit logs, dedicated war room view, custom REST/WebSocket API access, priority support
- **Prerequisites**: None. Invoice or enterprise agreement.

### Pricing Principles
- **No usage-history gatekeeping.** We do NOT require proof of Bloomberg, Reuters, or any other terminal usage.
- **No invitation system.** Anyone can subscribe to any tier.
- **Instant checkout.** Credit card, SEPA, wire transfer, invoice for enterprise.
- **Free tier exists** to let users experience the platform before paying.

## Content Policy — STRICT

### What BELONGS in this platform:
- Financial data and market analytics
- Trading tools and execution systems
- Risk management and compliance
- Economic data and indicators
- Financial news and media
- Geopolitical intelligence (as it affects markets)
- Institutional research tools

### What does NOT belong — DO NOT BUILD:
- Space, galactic, orbital, or sci-fi content of any kind
- Fictional characters, personas, or vanity panels (no "Boss Nur", no "Umay", no character lore)
- Cryptocurrency mining, DePIN compute-for-access, or client-side GPU mining
- Custom blockchain tokens (no "NUR Coin", no sovereign ledger)
- Civilizational ship fleets or faction systems
- Starship cockpits, warp drives, or space bridges
- Kids finance platforms or non-finance educational content
- Video production studios (we deliver financial media, not production tools)
- Any panel or feature that would make an institutional buyer question our credibility

### Panel Groups (GROUP_ORDER):
`["CORE", "MARKETS", "TRADING", "ANALYSIS", "RISK", "MEDIA", "SOCIAL"]`

The following groups have been REMOVED and must not be recreated:
- ~~GALACTIC~~ — All space/civilizational content eliminated
- ~~SOVEREIGN~~ — All vanity/personal content eliminated

Legitimate panels that were in SOVEREIGN (like sovereign-wealth-fund, sovereign-debt-auctions) have been moved to ANALYSIS or MARKETS.

## UX Principles

- **Bloomberg-like but modern.** The terminal should feel professional and dense like Bloomberg, but with modern web UX — responsive, 60 FPS, clean typography.
- **Categorized navigation.** The website and terminal toolbar should use clear, categorized dropdowns: Markets, Trading, Analysis, Risk, Media, Intelligence.
- **Performance first.** No panel should freeze the browser. 3D visualizations (like the geopolitical globe) must use lightweight Canvas2D by default, with WebGL only on-demand in dedicated panels, with proper GPU cleanup on unmount (`renderer.dispose()`, texture/geometry cleanup).
- **User-friendly.** Every feature should be discoverable through intuitive menus and toolbar buttons. Power users can use the command palette.

## Broadcast & Media System

The broadcast system delivers **institutional financial media**:
- Market opening/closing briefings
- Macro analysis segments
- Sector and earnings coverage
- FX and commodities updates
- Central bank and policy coverage

Anchor roles are **professional financial broadcast roles**:
- Global Macro Anchor
- Fixed Income & Rates Host
- FX & Commodities Strategist
- Chief Technical Analyst
- Emerging Markets Correspondent

No fictional characters. No personal vanity personas. No wardrobe rules or character lore.

## Project Structure

- **Framework**: Next.js 16.3.3 with Turbopack, React 19, Tailwind CSS 4
- **State**: Zustand (useIDEStore)
- **Database**: Supabase PostgreSQL
- **Market Data**: EODHD API
- **Design System**: CSS custom properties (--ag-accent, --ag-bg, --ag-surface, etc.)
- **Language**: ALL content must be in English. No Turkish text in any .ts/.tsx file.

## Security

- API keys must NEVER be committed to the repository
- Keys are configured as environment variables on hosting platforms only
- .env* is in .gitignore
- No client-side cryptomining or GPU compute harvesting — ever
- No smart contracts or blockchain token deployments
- Payment processing via standard institutional gateways (Stripe, SEPA, wire transfer)
