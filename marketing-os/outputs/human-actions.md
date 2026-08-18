# Human actions required — ONE batch

Everything on this page is blocked on a human. Everything **not** on this page
is being executed automatically without asking.

Last updated: 2026-08-18

---

## TIER 0 — Blocks the Product Audit (STEP 1). Nothing downstream is real until this clears.

The mission's first instruction is "inspect the existing product: website, GitHub
repo, features, user flow, analytics, signup, database, payment, SEO, traffic
sources." **None of that is reachable from this environment.** Here is exactly
what was tried and exactly what failed:

| # | What was attempted | Result |
|---|---|---|
| T0-1 | `WebFetch https://www.shilingshipu.com` | `EGRESS_BLOCKED` — the sandbox network policy denies this domain |
| T0-2 | `curl https://www.shilingshipu.com/` | `CONNECT tunnel failed, response 403` from the agent proxy |
| T0-3 | Web search for the domain | No public footprint. Nothing indexed under `shilingshipu.com` |
| T0-4 | List every repo this GitHub account can reach | `-zhimakaimen110119`, `ai-tree`, `questhero`, `ridepilot`. **No 时令食谱 repo exists on this account.** |

**Consequence:** an audit of core value, friction, conversion path, analytics
coverage, attribution readiness, or whether payment exists cannot be performed.
Any such report produced from here would be invented. It is not being produced.

**Pick ONE to unblock:**

- **T0-A (fastest, recommended).** Run this same mission on a Claude Code /
  Codex instance **on the Mac that has the 时令食谱 code checked out**. That
  agent can read the repo, the analytics config, the payment integration and
  the live pages directly. This session becomes the auditor of its output —
  which is the role your external reviewer already proposed.
- **T0-B.** Push 时令食谱 to a GitHub repo on this account, then say the name.
  It can be attached to this session in one call and the audit runs here.
- **T0-C.** Paste, in one message: the live HTML of the homepage and one recipe
  page, plus answers to the six questions in TIER 0-Q below. This is the
  lowest-bandwidth option and enough to start.

### TIER 0-Q — six answers that unblock the most work per word

1. What does the site actually do today — browse, search, filter by season, generate a plan?
2. Is there a signup / account / email capture on it right now? Yes or no.
3. Is there any payment integration wired up? Which processor?
4. Is any analytics installed — GA4, Plausible, Umami, Vercel Analytics, none?
5. Where are you, and where can you legally collect money — mainland entity with ICP filing, or overseas with Stripe / a merchant of record?
6. Is the seasonality data mainland-China-based, or does it handle other regions?

Question 5 is the one that most changes the strategy. Research Agent A's single
biggest finding was that 小红书's 2025 交易导流 rules plus the lack of an ICP
filing make a mainland-first funnel to a `.com` structurally unable to convert —
which points the whole plan at the overseas diaspora instead. That conclusion
inverts if a mainland entity and a WeChat Mini Program exist.

---

## TIER 1 — Platform authorization (STEP 7). Do NOT do this yet.

Deliberately withheld until TIER 0 clears, because content is being written
against an unverified product and would have to be redone.

When it is time, it will arrive as exactly one list of logins and nothing else:

| Platform | What is needed | Why |
|---|---|---|
| TikTok | account + Content Posting API access | scheduled publishing |
| Instagram | Business account + Facebook Page + Graph API | Reels publishing |
| YouTube | channel + Data API OAuth | Shorts publishing |
| Pinterest | business account + API access | the cleanest attribution surface |
| X | account + API tier | text posts |
| 小红书 | account only, manual posting | no compliant publishing API exists; assume permanent manual |

Also needed at that point, and cheap: an email service (Resend / Buttondown /
ConvertKit free tier), and a payment link (Stripe Payment Link, or Gumroad /
Lemon Squeezy if a merchant of record is required).

---

## Nothing else is waiting on you

Currently running or complete without approval: market research, the
independent council, red-team attack, judging, campaign design, content
generation, tracking scheme, UTM and `content_id` assignment, and the publish
queue. Those continue regardless of this page.
