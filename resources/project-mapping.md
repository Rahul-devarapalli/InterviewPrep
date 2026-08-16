# Project → Concept Mapping

Use this to ground interview answers in real experience instead of textbook phrasing.

| Concept | Project to Reference | Talking Point |
|---|---|---|
| Large-scale migration / refactoring | Canara Fleet Portal (AngularJS → React) | 149 screens, 323 APIs, ~85K LOC migrated in ~3 months using AI-agentic workflows |
| Reconciliation / financial data matching | Settlr | FinOps reconciliation engine, payment matching logic, Next.js/Node/PostgreSQL/Prisma |
| AI-assisted development workflow | Settlr, CodeAudit AI, Canara migration | Using Claude Code / Copilot / Antigravity to accelerate delivery — a key differentiator |
| Code review automation | CodeAudit AI | AI-driven PR review platform |
| SQL / relational data design | Settlr (Postgres + Prisma) | Schema design for transaction matching, indexing for reconciliation queries |
| System design / scaling | Canara Fleet Portal | Handling 323 APIs across a large legacy-to-modern migration |
| Company-specific: Broadridge (BRx Match) | Settlr | Draw parallel between BRx Match reconciliation product and Settlr's matching engine |

## How to use this in an answer
Pattern: **Concept → brief textbook framing → pivot to real project → concrete detail.**

> "Memoization caches expensive computed results — in Settlr, we used something similar
> to avoid recomputing match scores for transaction pairs that hadn't changed between
> reconciliation runs."
