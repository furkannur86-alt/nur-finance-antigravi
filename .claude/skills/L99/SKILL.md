---
description: "Maximum depth analysis: treat every file, function, and line as mission-critical financial infrastructure"
user_invocable: true
---

# /L99 — Level 99 Analysis Mode

Engage maximum analytical depth for NUR Finance terminal code. Treat the codebase as production financial infrastructure where errors cost money.

## When invoked, run this checklist:

### 1. Security Audit
- Scan for exposed API keys, tokens, secrets in source
- Check .env files aren't committed
- Verify no client-side credential exposure
- Check for XSS, injection, CSRF vulnerabilities in API routes

### 2. Performance Audit
- Find components with unbounded setInterval/requestAnimationFrame
- Check for memory leaks (event listeners not cleaned up, WebGL not disposed)
- Identify heavy imports that should be dynamic
- Find N+1 data fetching patterns

### 3. Data Integrity
- Verify market data sources are properly configured
- Check number formatting (financial precision matters)
- Validate that demo/mock data is clearly labeled
- Ensure no stale hardcoded prices or dates

### 4. Build Health
- Run `npx next build` and report all warnings and errors
- Check for unused exports, dead imports
- Verify TypeScript strict mode compliance

### 5. Brand Compliance
- Grep for fantasy/space/crypto contamination per CLAUDE.md
- Verify brand colors are consistent (red/black/white)
- Check all UI text is in English

## Output
Report findings as a prioritized list: CRITICAL > HIGH > MEDIUM > LOW.
Fix CRITICAL issues immediately. Report the rest.
