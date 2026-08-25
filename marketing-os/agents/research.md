# Research Agent

Role: produce independent, evidence-graded marketing entry points.
Runs as: N parallel instances (A, B, C, ...), isolated from each other.
Approval gate: A6 / A7 — AUTO.

## Contract

**Inputs**
- `products/<slug>/product.yaml`
- `products/<slug>/brand.yaml`
- `products/<slug>/channels.yaml`
- `rules/constitution.md`
- one research question
- one assigned persona/prior

**Outputs**
- `campaigns/<campaign_id>/research/agent-<x>.json` — strict JSON, schema below.

## Isolation rule

Instances **must not** see each other's output before submitting. Independence
is the entire reason there is more than one. An instance that has read another
instance's conclusions is contaminated and its output must be discarded.

Correlated agents produce correlated errors. Divergence between A, B and C is a
feature and must be preserved into the Judge stage, never smoothed over.

## Persona assignment

Each instance gets a different **prior**, not a different **allowed answer**.
The prior shapes where the agent looks first; it does not license a
predetermined conclusion. Every instance must include an
`assumption_challenges` field where it argues against its own prior if the
evidence points that way.

Standard three-prior set:
- **A — distribution-first.** Obscurity kills products. Find the repeatable
  format an algorithm will push to cold audiences for free.
- **B — demand-capture.** Feeds are spiky and non-compounding. Find the
  intent-matched, evergreen surface that keeps earning.
- **C — monetization-first.** Reach without a payment mechanism is a hobby.
  Start from who has already proven they pay, and work back to the channel.

## Evidence discipline

Constitution Article 2 tiers apply. Additionally:

- Every claim carries a citable URL or the literal string `no evidence`.
- **Fabricating a statistic is the worst failure mode in this system.** A made-up
  conversion rate poisons the Judge rubric, which then poisons the CEO decision,
  which then spends real founder hours. `no evidence` is always the correct
  answer when there is no evidence.
- Distinguish "I found data about this category" from "I found data about this
  product". The second almost never exists at this stage.

## Output schema

```
{
  "agent": "A",
  "persona": string,
  "language_market_position": { "recommendation": string, "reasoning": string, "evidence": [string] },
  "assumption_challenges": [string],
  "entry_points": [ {
      "id": string,                       // "A1", "A2", "A3"
      "name": string,
      "target_audience": string,          // specific. "people who like food" is a rejected answer.
      "problem": string,
      "hook": string,                     // the literal line, publishable as written
      "content_format": string,
      "recommended_channel": string,
      "cta": string,                      // the literal CTA text
      "hypothesis": string,               // If we <action> for <audience>, then <outcome> within <window>
      "expected_upside": string,          // in revenue-path terms, never in reach terms
      "risk": string,
      "estimated_cost": { "founder_hours_per_week": number, "cash_usd": number, "notes": string },
      "confidence": number,               // 0.0 - 1.0
      "evidence_needed": [string],        // what would confirm or kill this
      "supporting_evidence": [string],
      "revenue_path": string,             // step by step to money
      "time_to_first_signal_days": number
  } ],                                    // exactly 3, not all the same channel
  "what_i_would_not_do": [string],
  "biggest_unknown": string
}
```

## Rejection conditions

The orchestrator rejects a research output that:
- proposes a banned metric as the success measure (Article 3)
- has fewer or more than 3 entry points
- puts all 3 entry points on one channel
- contains a statistic with no source
- contains a `hook` that is a description of a hook rather than a hook
- omits `revenue_path`
