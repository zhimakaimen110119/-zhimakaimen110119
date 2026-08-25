# Approval Policy

Version: **2** — amended 2026-08-18 by founder standing authorization
Supersedes: v1 (2026-08-18)
Governed by: `rules/constitution.md` Article 7.
Machine-readable form: `rules/approval-policy.json`.

## What changed in v2, and why

v1 gated on the **category** of marketing activity. v2 gates on **spend size and irreversibility**.

The founder's instruction: stop asking about things that are cheap, reversible and legal. That is the correct trade. A gate that fires on every piece of copy trains the human to rubber-stamp, which makes the gate worthless exactly when it matters. Fewer gates, each of which actually means something.

**Unchanged:** the default for anything not listed here is still **HUMAN**. Do not read v2's shorter list as permission to improvise.

---

## HUMAN approval required

| # | Action | Boundary |
|---|---|---|
| H1 | **Real spend over $50 in a single expenditure** | At or under $50 and reversible → AUTO. Recurring charges count at their annual total, not their monthly slice. |
| H2 | **Login, CAPTCHA, KYC, real-name or phone verification, OAuth grant** | The human is the account holder. No agent creates or authenticates an identity. |
| H3 | **Any irreversible operation** | If you cannot undo it in an afternoon, ask. |
| H5 | **Legal or high-risk claims** | Health outcomes, medical, nutrition, allergen safety, legal, financial. For a food product this is the live one — see below. |
| H6 | **Destructive operations** | Deleting a product, an account, published content, or production data. |
| H10 | **Private-individual data** | Public business contact data is explicitly NOT this and is AUTO. Data about private individuals stays HUMAN. |

### H5 in practice for this product

`AUTO`: "this is what's in season in Washington right now", "traditionally eaten at 处暑", "cheaper this fortnight", "tastes better now".

`HUMAN`: anything asserting a health outcome — 润肺, 降火, 排毒, detox, immunity, blood sugar, anti-inflammatory, weight loss — and any allergen-safety assurance. Selling to restaurants raises the stakes: a claim they repeat to their own customers becomes their liability.

---

## AUTO — execute without asking

| # | Action |
|---|---|
| A1 | Generating marketing content of any volume |
| A2 | Creative **and pricing** tests — headlines, hooks, titles, offers, price points |
| A3 | Posting times and cadence |
| A4 | SEO — keywords, metadata, structured data |
| A5 | Any experiment costing $50 or less |
| A6 | **Public business research and prospect screening** — searching public listings, websites, menus, public social accounts |
| A7 | Creating campaigns, experiments and hypotheses |
| A8 | Judge scoring and CEO decisions |
| A9 | Publish queue, UTM, content_id assignment |
| A10 | Analytics, dashboards, retrospectives |
| A11 | Killing, pausing **or scaling** a campaign |
| A13 | **Narrowing or switching the target audience** within the product's category |
| A14 | **Landing page and site copy** |
| A15 | **Zero-cost outreach to public business contacts** (replaces v1's H9) |
| A16 | Channel tests |

### A15 — outreach discipline

Gone from the approval queue, not from the rules. Zero-cost outreach is AUTO **only** when:

- messages are **personalized one at a time** — no bulk blast, no mail-merge that reads like one
- the recipient is a **business at a public contact point**, not a private individual
- **every opt-out is honoured immediately and permanently**
- nothing is misrepresented — no fake mutual connections, no invented referrals, no pretending to be a customer
- the first message gives something real before asking for anything

A15 covers zero-cost channels. A paid outreach tool crosses into H1 at $50.

### A13 — the limit

A13 covers moving from "home cooks" to "small restaurants". It does **not** cover changing what the product fundamentally is or what it promises. A wholesale repositioning still gets raised, per Constitution Article 9's concern that positioning is the compounding asset.

---

## How an approval request works

Unchanged from v1. Agent writes `outputs/approvals/<campaign_id>-<n>.md` with what it wants, the rule that triggered the gate, the cost, whether it is reversible, the fallback if denied, and `decision: PENDING`. Execution stops for that branch only. `mos.mjs validate` refuses launch-ready while a blocking approval is PENDING.

An agent that executes a HUMAN-gated action without a signed `APPROVED` has committed a Constitution violation and the campaign is void. **v2's shorter list makes this more serious, not less** — there are now only six gates, and each one exists because crossing it costs real money, real identity, or real legal exposure.
