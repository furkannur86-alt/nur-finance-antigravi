@AGENTS.md

# NUR Finance AntiGravi — Project Rules

## CRITICAL BUSINESS RULES: NUR Finance B & NUR Finance R Access Control

These rules are NON-NEGOTIABLE. They govern who can access NUR Finance B (Bloomberg-tier) and NUR Finance R (Reuters-tier) products. Every developer, agent, and system working on this project MUST enforce these rules. They apply to the website, terminal, APIs, onboarding flows, payment systems, and all related infrastructure.

### Product Definitions

- **NUR Finance R** — Reuters-tier terminal (~€100K/year). Competes with and surpasses Reuters Eikon.
- **NUR Finance B** — Bloomberg-tier terminal (~€100K/year). Competes with and surpasses Bloomberg Terminal.

### Entry Requirements

#### NUR Finance R
- **Prerequisite**: Applicant must have a MINIMUM of 1 year of active Reuters usage history.
- **No invitation required**: Anyone meeting the Reuters history requirement can subscribe.
- Without 1 year Reuters history → ACCESS DENIED. No exceptions.

#### NUR Finance B
- **Prerequisite 1 (Necessary)**: Applicant must have a MINIMUM of 1 year of active Bloomberg usage history.
- **Prerequisite 2 (Necessary)**: Applicant must receive a confirmed invitation email from a person hand-selected by NUR Finance leadership. Bloomberg history alone is NOT sufficient.
- **Security**: Email-based identity verification — the invitee must confirm "I am at this email" through a secure verification flow.
- Without 1 year Bloomberg history → ACCESS DENIED. No exceptions.
- Without invitation confirmation → ACCESS DENIED. No exceptions.

### Transition Rules

| From | To | Rule |
|------|----|------|
| Bloomberg (external) | NUR Finance B | ALLOWED — if they have 1yr Bloomberg history + invitation confirmation |
| Reuters (external) | NUR Finance R | ALLOWED — if they have 1yr Reuters history |
| NUR Finance B | NUR Finance R | ALLOWED — can switch freely |
| NUR Finance R | NUR Finance B | BLOCKED — see special process below |

#### Special Process: NUR Finance R → NUR Finance B

A NUR Finance R user who wants to switch to NUR Finance B must:

1. **Purchase a Bloomberg subscription** (keep NUR Finance R active)
2. **Use Bloomberg for 1 full year** (while continuing to use NUR Finance R)
3. **After 1 year of Bloomberg**: May close Bloomberg contract and switch to NUR Finance B (still requires invitation confirmation)
4. **WARNING**: If the user closes BOTH Bloomberg AND NUR Finance R during this process, they permanently lose access to NUR Finance R as well. No reinstatement.

#### Summary

- NUR Finance B → NUR Finance R: Free transition, anytime
- NUR Finance R → NUR Finance B: Must first get 1yr Bloomberg, keep NUR R active, then switch
- Closing both Bloomberg + NUR Finance R during transition = permanent ban from NUR Finance R
- NUR Finance B always requires invitation from approved persons, regardless of path

### Implementation Notes

- The onboarding/signup flow MUST verify Bloomberg/Reuters usage history (integration with their systems or document verification)
- NUR Finance B requires an invitation system with email confirmation
- The invitation list is maintained by NUR Finance leadership only
- These rules must be prominently displayed in the Pricing/Plans page
- Backend must enforce these rules — frontend display alone is insufficient

---

## Project Structure

- **Framework**: Next.js 16.3.3 with Turbopack, React 19, Tailwind CSS 4
- **State**: Zustand (useIDEStore)
- **Database**: Supabase PostgreSQL
- **Market Data**: EODHD API
- **Design System**: CSS custom properties (--ag-accent, --ag-bg, --ag-surface, etc.)

## Security

- API keys must NEVER be committed to the repository
- Keys are configured as environment variables on hosting platforms only
- .env* is in .gitignore
