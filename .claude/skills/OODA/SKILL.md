---
description: "OODA loop decision framework: Observe-Orient-Decide-Act for rapid financial terminal development"
user_invocable: true
---

# /OODA — Observe-Orient-Decide-Act Loop

Military-grade decision loop adapted for NUR Finance terminal development. Run one complete OODA cycle on the current state of the project.

## Observe
- `git status` — what's changed, what's staged, what's untracked
- `git log --oneline -10` — recent commit history
- Check dev server status — is it running? Any errors?
- Quick grep for known problems (fantasy contamination, broken imports, TODO/FIXME)
- Read any user feedback from the conversation

## Orient
- What is the current project state relative to the goal (professional financial terminal)?
- What are the top 3 blockers right now?
- What has the user explicitly asked for vs. what needs proactive fixing?
- Compare current state against CLAUDE.md content policy and UX principles
- Identify quick wins vs. deeper structural work

## Decide
- Pick the single highest-impact action to take next
- If multiple actions are independent, parallelize them
- Prioritize: user-requested features > build errors > contamination > performance > polish
- State the decision in one sentence

## Act
- Execute the decision immediately
- Build verify after changes
- Commit if the change is complete and correct
- Report result in 2-3 sentences

## Loop
After Act, run another OODA cycle. Stop when:
- All user requests are fulfilled
- Build passes clean
- No critical issues remain
