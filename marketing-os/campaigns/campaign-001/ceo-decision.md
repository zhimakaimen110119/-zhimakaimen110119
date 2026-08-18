# CEO Decision — Campaign 001

Date: 2026-08-18
North Star: sustainable revenue
Judge scores: `campaigns/campaign-001/judge-scores.json` (computed by `lib/mos.mjs judge`)

---

## The decision

**Primary experiment: RT1 — the B2B 节气 operations pack, sold by 1:1 outreach.**
Weighted 8.00, first by a 1.05 margin over a field of eleven.

Supporting experiments: **C3M** (consumer pre-order, 6.95) and **EXP-003** (the zero-cost kill sweep).
Deferred: **小红书 in all three of its forms**, with a hard trigger.

## Why this over the others

**It is the only position that does not depend on the unresolved question.** Every one of the nine council plans forks on whether the founder is mainland or overseas — different supermarket, different rail, different language register, different price. RT1 forks much less: small food businesses that lose money by mis-guessing the season exist in both markets (私房菜 and 社区团购 团长 in the mainland; 私厨 and meal-prep sellers in the diaspora). The pack's structure, the outreach script and the price ladder survive either answer. Only the ingredient list swaps.

That property is worth more than its score. Three independent agents told us the plan is undetermined until one fact resolves. The correct response is not to guess the fact — it is to find the move that is right under both branches, and run that first.

**It attacks the most dangerous assumption directly.** The Red Team's sharpest finding: all three agents priced at ¥39 because the value is low, not because the market is price-sensitive. A home cook can see what is in season by walking past the stall. That is the profile of a product nobody pays for. RT1 tests the opposite buyer — one for whom seasonality is a recurring operational input with money attached — and it tests it in three hours instead of six weeks.

**It is the only channel where attribution actually works.** The Red Team's measurement finding reframes the whole ranking: 小红书 has no referrer, no click data, no note-level conversion, and contact details in DMs and auto-replies have been a documented violation since Jan 2025. Without note-level feedback you cannot iterate content — you are not running an experiment, you are buying lottery tickets. 1:1 outreach gives 100% attribution by construction. At 10 h/wk, learning rate is the binding constraint, not reach.

**Why not the highest-reach options.** A1, B1 and C1 (all 小红书) rank 5th, 7th and 10th and all carry disqualifiers. The Feb 2026 digital-goods gate is verified across three independent sources: 1,000 followers, 180 days, 30 notes, ¥6,000 monthly GMV before a new account may legally sell anything digital. Three agents independently chose the channel where revenue is gated behind the audience they were trying to build. That is correlated error, not consensus.

**Why not the two 小报童 plans.** B3 and C2 rest on a claim the Red Team refuted: 小报童 is not open registration, carries a reported ~3,000-follower de-facto bar, and pays only through 云账户 against a mainland ID and bank card. Both plans share that single point of failure, so they were never two bets.

## Judge agreement

**Accepted.** The Judge's ranking is adopted without override.

One note on provenance: the winning position came from the Red Team, not from any of the three research agents. That is the system working as designed, not a failure of the council — the council's job was to map the space, and mapping it well is what made the gap visible.

## Scope cuts

- RT1 as proposed is a repositioning. **Cut to a three-hour falsification test.** Ten sends, one pack, one price. No repositioning of the product, no landing page, no rebrand until three strangers say yes.
- C3M's original form had twelve free weeks before any price. **Cut to a pre-order today.** If nobody pre-orders, twelve weeks of free content will not fix it.
- EXP-003 was going to be nine kill tests. **Cut to the three with the best information-per-hour**, which between them can retire five positions.

## Thresholds — set before launch, not after

| Experiment | Primary metric | Success | Kill | Decide |
|---|---|---|---|---|
| EXP-001 (RT1) | paid_conversions | ≥3 of 10 say yes to ¥199 | 0 replies from 10 | 2026-09-01 |
| EXP-002 (C3M) | paid_conversions | ≥1 stranger pays $19 | 0 sales in 7 days | 2026-08-28 |
| EXP-003 (kill sweep) | experiment_result | all 3 checks completed | — | 2026-08-22 |

EXP-001's success threshold is deliberately 3, not 1. One yes from ten could be politeness or a friend. Three is a rate.

## What would change my mind

- **小报童 accepts the application immediately with no follower bar.** Then C2 and B3 revive and the consumer path gets a working rail.
- **Keyword Planner shows real volume.** If the 15 head terms clear ~500/month combined, A3 stops being a 12-week gamble and becomes the compounding asset the portfolio needs.
- **Three of ten B2B prospects say yes but all want a different deliverable.** Then the buyer is right and the product is wrong — follow the buyer.
- **The founder turns out to be overseas with a working Stripe.** C3M's ceiling rises ~5x and it may deserve to be primary instead.

## Pre-mortem

> It is 2026-09-01. This campaign failed. The most likely reason is **that the founder never sent the ten messages, because the pack did not exist and building it felt like a project.**

That is fixable before launch, and it is fixed: the OS has written the 处暑 pack (`content/chushu-pack-v1.md`) and all ten outreach messages. The founder's remaining work is to paste and send. Nothing about this campaign requires the founder to create anything from scratch.

The second-likeliest failure — that the ingredient list is wrong for the founder's region — is handled by marking every ingredient `verify at your market` and by keeping the swap to one section.

## Blocking unknowns

1. **Founder residence and rail.** Not blocking EXP-001. Blocking EXP-002 entirely — a pre-order page needs a working checkout.
2. **Whether the site has any analytics or email capture.** Blocking all downstream Tier-3 measurement. EXP-001 routes around it by measuring replies in a spreadsheet, which is why it can run today.
3. **Whether the seasonality data is mainland or multi-region.** Determines which ingredient list ships.

## Approval requests raised

- **H9 — direct outreach.** EXP-001 requires messaging ten real businesses. Agents may not contact real people. Request written to `outputs/approvals/campaign-001-1.md`. The founder sends; the OS only drafts.
- **H8 is NOT raised.** Nothing here publishes to a platform. Phase 1 gate holds.

## Deferred, with triggers

| Deferred | Revive when |
|---|---|
| 小红书 (A1 / B1 / C1) | The account is ≥180 days old AND a message has already been proven to convert on a measurable channel. Deferring costs nothing — the 180-day clock runs regardless. |
| Chinese SEO (A3 / B2) | Keyword Planner shows ≥500 combined monthly searches across the 15 head terms. One free hour decides this. |
| 小报童 column (B3 / C2) | The creator application is accepted without a follower bar. |
