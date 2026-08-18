# Approval Policy

Version: 1.0
Governed by: `rules/constitution.md` Article 7.
Machine-readable form: `rules/approval-policy.json` (enforced by `lib/mos.mjs`).

Two gates exist:

- **`AUTO`** — an agent may execute without asking.
- **`HUMAN`** — the OS must stop, write an approval request into
  `outputs/approvals/`, and wait. No agent may self-approve, and no agent may
  interpret silence as approval.

The default for anything not listed here is **`HUMAN`**.

---

## HUMAN approval required

| # | Action | Why |
|---|---|---|
| H1 | Any real advertising spend, of any amount, on any platform | Irreversible cash out |
| H2 | Account registration, KYC, identity verification, phone/email verification, CAPTCHA solving | The human is the account holder; agents must not create identities |
| H3 | Any irreversible operation | Cannot be undone by definition |
| H4 | Significant price changes | Directly moves the North Star and is visible to existing customers |
| H5 | Sensitive-category claims — legal, medical, health, nutrition, financial, safety | Regulatory and trust exposure |
| H6 | Deleting a product, an account, a dataset, or published content | Destructive |
| H7 | Changing core brand positioning | Positioning is the compounding asset; churn on it destroys value |
| H8 | First real publish to any platform, per platform | The Phase 1 → Phase 2 gate |
| H9 | Contacting real people directly — DMs, cold email, outreach lists | Reputational and anti-spam exposure |
| H10 | Anything touching user PII or a customer list | Privacy |
| H11 | Partnerships, sponsorships, affiliate agreements, or any commitment on the founder's behalf | Binds a real person |
| H12 | Publishing a competitor comparison, or any claim about a named third party | Legal exposure |

### Sensitive-category detail (H5)

For a recipe / food product this specifically catches:
"cures", "detox", "boosts immunity", "lowers blood sugar", "anti-inflammatory",
"weight loss", "medicinal", "food therapy / 食疗" health claims,
"安全食用" claims about allergens, foraging or wild-ingredient safety, and any
claim about pregnancy, children or medical conditions.

Traditional-cuisine framing ("this is what people traditionally eat in
autumn") is `AUTO`. A health *outcome* claim is `HUMAN`.

---

## AUTO — no approval needed

| # | Action |
|---|---|
| A1 | Generating marketing content of any volume into the queue |
| A2 | Headline / hook / thumbnail / title A-B tests |
| A3 | Choosing posting times and cadence |
| A4 | SEO work: keywords, metadata, internal linking, structured data, sitemaps |
| A5 | Any zero-cash experiment |
| A6 | Research, competitive analysis, reading public sources |
| A7 | Creating campaigns, experiments and hypotheses in this repo |
| A8 | Judge scoring and CEO decisions **within** this repo |
| A9 | Building the publish queue and its UTM links |
| A10 | Analytics, dashboards, retrospectives |
| A11 | Killing an underperforming campaign per Article 10 |
| A12 | Drafting an approval request for a HUMAN item |

Note on A11: **killing** an internal campaign is AUTO. **Deleting** anything
already published is H6.

---

## How an approval request works

1. Agent detects a HUMAN-gated action.
2. Agent writes `outputs/approvals/<campaign_id>-<n>.md` containing:
   - what it wants to do, in one sentence
   - which rule triggered the gate (H-number)
   - the cost, and whether it is reversible
   - what happens if approval is denied (the fallback plan)
   - an explicit `decision: PENDING` line
3. Execution stops for that branch only. Everything else continues.
4. A human edits `decision:` to `APPROVED` or `DENIED` and signs with a date.
5. `mos.mjs validate` refuses to mark a campaign launch-ready while any
   blocking approval is `PENDING`.

An agent that executes a HUMAN-gated action without a signed `APPROVED` line
has committed a Constitution violation, and the campaign is void.
