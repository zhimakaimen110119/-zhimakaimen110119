# Human actions required — ONE batch

Updated: 2026-08-18, after the council, Red Team, Judge and CEO decision.

Three things need you. Nothing else does. Total time: **about 50 minutes.**

---

## 1 · Answer one question (60 seconds)

**Are you resident in mainland China with no company, or overseas / incorporated?**

Three research agents, working in isolation with three different priors, each independently named this as their single biggest unknown, unprompted, in their own words. It decides the language, the channel, the price point (by roughly 5x) and the payment rail.

If it helps, the fuller version:
- Country of residence
- Do you hold a mainland 身份证, a mainland bank card and a real-name WeChat?
- Is the site's seasonality data mainland-only, or multi-region?

**What each answer unlocks:**
- **Mainland, no entity** → rails are a plain 微信收款码 with manual delivery for the first twenty buyers, then 知识星球 or 公众号付费阅读. Stripe is confirmed unavailable to you. The pack's ingredient list as written is already correct.
- **Overseas / incorporated** → Payhip or Ko-fi in your country, EXP-002 unblocks, and the ingredient list swaps to your local produce calendar.

## 2 · Sign one approval (5 minutes)

`outputs/approvals/campaign-001-1.md` — rule **H9, contacting real people**.

The OS drafted ten outreach messages and cannot send any of them. Read them first: `campaigns/campaign-001/content/outreach-messages.md`. Do not approve a message you have not read.

Change `decision: PENDING` to `APPROVED` or `DENIED`, sign, date. `mos.mjs validate` refuses to mark the campaign launch-ready until you do — this is the one FAIL in the current dry run, and it is intentional.

## 3 · Name ten businesses (40 minutes)

The OS cannot know who is in your contacts. Ten small food businesses you can already reach: 私房菜, 社区团购团长, 便当 sellers, a bakery studio, a 生鲜 shop, a small restaurant. The ten drafted messages are already segmented by type.

Then send, and log each in `analytics/campaign-001-tracking.csv`.

---

## Still blocked, still unresolved

**MC-01 — the product itself is unreachable from this environment.** `WebFetch` returns `EGRESS_BLOCKED`; `curl` gets `403 CONNECT` from the agent proxy; the domain has no public search footprint; and no 时令食谱 repository exists on this GitHub account (only `-zhimakaimen110119`, `ai-tree`, `questhero`, `ridepilot`). So no product audit has been performed and none was invented. To clear it: run this mission on the machine that has the code, or push the repo here and name it.

**MC-02 — no analytics.** Unknown whether GA4/Plausible/Umami exists. Every UTM in the queue is built correctly and lands nowhere measurable until one does.

**MC-03 — no link tracking domain.** UTMs are constructed; there is no shortener or click-tracking host.

**MC-04 — no email service and no list.**

**MC-05 — no payment rail confirmed.** Downstream of question 1.

---

## Deliberately NOT asked for

**Platform logins — TikTok, Instagram, YouTube, Pinterest, X, 小红书.** All six are withheld on purpose.

The Judge ranked 小红书 5th, 7th and 10th of eleven, each with a disqualifier. The Feb 2026 digital-goods gate is verified across three independent sources: 1,000 followers, 180 days, 30 notes, ¥6,000 monthly GMV before a new account may legally sell anything digital. Asking you to authorize six accounts you cannot yet sell through, on a channel where clicks cannot be attributed, would be motion, not progress.

They will be requested in one batch when a message has been proven to convert somewhere measurable. Deferring costs nothing — the 180-day clock runs whether or not you sign up today.
