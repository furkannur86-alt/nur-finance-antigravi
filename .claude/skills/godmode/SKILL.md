---
description: "Full autonomous mode: analyze codebase, fix all issues, build, commit, push without stopping to ask"
user_invocable: true
---

# /godmode — Autonomous Build & Ship

When invoked, operate in full autonomous mode for this NUR Finance terminal codebase:

## Execution Protocol

1. **Scan** — `git status`, `git diff`, grep for known contamination patterns (fantasy refs, broken imports, TypeScript errors)
2. **Fix everything found** — edit files, delete dead code, clean contamination, fix type errors
3. **Build verify** — run `npx next build` and fix any compilation errors
4. **Commit & push** — stage changes, write a clear commit message, push to the development branch
5. **Report** — one summary of what changed, what was fixed, what remains

## Rules

- Do NOT stop to ask permission for edits, deletes, or commits
- Do NOT explain what you're about to do — just do it
- Fix TypeScript errors, broken imports, fantasy contamination, dead code in one pass
- If build fails, fix and retry up to 3 times
- Respect CLAUDE.md content policy — never introduce space/fantasy/crypto content
- Respect CLAUDE.md security rules — never commit API keys
- Brand colors: red (#cc0000), black (#0a0a0a), white (#ffffff)
- All text in English
