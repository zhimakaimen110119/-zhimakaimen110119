# USD Pricing Hypothesis — US market

Researched 2026-08-18. Replaces the ¥199/quarter figure from campaign-001, which is **void**: it was a mainland number, quarterly rather than per-pack, and at ~$28 for three months it prices below a $50/yr consumer recipe newsletter on a per-month basis. **Discard it, do not convert it.**

## The hypothesis

**$49, one time, for one 节气 pack built against that restaurant's actual menu.**
Not a subscription. Owner sends a menu photo; PDF back within 48 hours; refund on request, no questions.

## Why $49

**It lands on a price tier the buyer already recognizes.** The self-serve entry tier of restaurant software clusters exactly here — meez Starter $19–24/mo, Square for Restaurants Plus $49/mo, BentoBox from $49/mo. A single-location Chinese restaurant owner *is* the buyer; there is no approver, so the constraint isn't an approval threshold, it's a regret threshold.

**It is trivially defensible against what it replaces.** Done-for-you social captions start at $99/mo (Feedbird, $99 Social). Menu engineering as a project runs $2,000–$20,000. Restaurant consulting is $100–$300/hr.

**The ROI argument survives a skeptical owner.** The National Restaurant Association publishes 4–10% of purchased food wasted before reaching a customer, and ~$8 saved per $1 invested in waste reduction. A restaurant buying ~$190k of food a year is losing roughly $7,700–$19,200. $49 needs to recover well under 1% of that.

**Fee math.** Stripe takes $1.72 on $49 (3.5%). At $19 the fee plus fulfillment hours makes the sale actively unprofitable and teaches nothing.

**Signal quality.** High enough that a yes means the buyer actually decided. Low enough that a stranger with no logo, no company and no references can still get it.

### Why not ~$16
It stops being a test — anyone pays $16 to be polite. And it anchors the product against a free USDA produce report instead of against a $99/mo social agency. That anchor is very hard to climb out of with the same customer.

### Why not ~$149
Cold outreach from an unknown solo vendor at $149 needs a meeting, a reference or a sample first — turning a two-message transaction into a multi-week cycle. It also crosses into the tier (Popmenu $179, MarketMan $199) where owners expect a company, a contract and support. Right as the *second* experiment, after 3–5 people have paid $49.

## The ladder to test

| Variant | Price | Tests |
|---|---|---|
| Generic pack, not customized | $29 | Whether price is the objection at all. If $29 generic converts no better than $49 customized, the objection is trust or relevance — stop discounting, start customizing. |
| **Customized to their menu — PRIMARY** | **$49** | Will a stranger pay real money once, with no relationship, for a customized operations artifact. |
| Pack + 20-min call on their menu | $99 | Whether the human consultation is the real product. Similar conversion at $99 means the product is advisory and should be priced far higher. |
| Season prepaid — 6 packs + 2 calls | $249–299 | Whether a serious-looking pilot beats a cheap one. Only after $49 has 3+ buyers. |
| Subscription, 2 packs/mo | $39/mo | Retention. Offer only AFTER one paid pack. |
| Annual prepaid, 24 packs | $399/yr | Cash-up-front willingness. |

## The offer, verbatim

**EN:** Send me a photo of your current menu and I'll build you one 节气 pack for the next solar term — which Pacific Northwest produce is peaking in the next 15 days with buying and selection notes, 6–8 dishes you could run from it with rough food cost, and 3 captions you can paste straight into your social — delivered as a PDF within 48 hours for $49, one time, not a subscription, and if it isn't useful to you I'll refund it, no questions.

**中文：** 您把现在的菜单拍张照发我，我按下一个节气给您做一份「节气运营包」：未来15天西雅图本地最当造的时令菜（含采购和挑选要点）、用这些食材可以上的6–8道菜（附大致成本）、外加3条可以直接复制发布的社媒文案。48小时内以PDF交付，一次性收费 49 美元，不是订阅、不自动续费；如果您觉得用不上，我全额退款，不问原因。

## Payment rail — confirmed workable

A US sole proprietor can open and activate Stripe without forming a company; where the activation form asks for an EIN you select that the business has none and provide an SSN or ITIN. Stripe is available across the US. Create a **Payment Link** for a single fixed-price product — no website, no code, no integration. Paste the URL into WeChat, SMS or email.

**Only switch the link to recurring after the one-time pack has proven it converts.**

## The economics actually break on fulfillment, not price

At 90 minutes of customization per pack, 25 customers × 2 packs/month = 75 hours/month against ~$2,300 gross — about $30/hour before any acquisition cost. **The survival question is not "what price" but "how much of each pack is identical across all customers."** Target 80%+ one-to-many (same PNW produce, same base dishes, same captions) with a thin customization layer on top.

Customers needed for $1k MRR: ~11 at two $49 packs a month, ~21 at one, ~27 at the $39/mo rung. In a metro this dense with Asian restaurants that is a hand-sold number, not a funnel number.

## Two things to handle before scaling — not before the first $49

1. **Washington sales tax.** WA ESSB 5814 (effective Oct 1, 2025) broadened retail sales tax to additional digital automated services and removed the "human effort" exclusion. Whether a paid seasonal-report product falls inside is genuinely unresolved and it affects the sticker price. **This needs a WA CPA, not a search engine.** If it turns out taxable, price tax-inclusive so the quoted number stays clean. Nothing here is tax or legal advice.
2. **WA business licensing.** The Department of Revenue publishes a threshold at $12,000/yr gross income, among other triggers such as trading under a name other than your legal name. Read the DOR page directly.

Neither blocks a $49 test. Both block scaling.

## What could not be verified

- **Every price above came from search-result synthesis, not from reading the vendor page** — the egress proxy blocked stripe.com, squareup.com, getmeez.com, refed.org and others. Open each cited URL and confirm before quoting a number to a customer.
- The 4–10% waste figure is republished by the National Restaurant Association but could not be traced to a named primary study.
- **No produce-specific waste percentage exists, and nothing isolates waste caused by poor seasonal buying** — the exact loss this product claims to reduce. The ROI argument is directional. **Do not put a precise dollar savings claim in outreach.**
- No evidence for any specific SMB "no-approval" price ceiling. The under-$50 recommendation rests on observed market tiers, not behavioural research.
- No count of Chinese/Asian restaurants in the Seattle metro. TAM unquantified. (King County is one of eight US counties where ≥25% of restaurants serve Asian food, with Chinese in the top three cuisines — a signal, not a count.)
- **No conversion-rate or CAC data for cold outreach to Chinese restaurant owners.** Any LTV > CAC claim before 10 real sales would be fiction.

### Sources
Capterra/meez pricing · Square for Restaurants tiers · Toast POS pricing · MarketMan pricing · Popmenu pricing · BentoBox pricing · Feedbird · $99 Social · restaurant.org food-waste resource · ReFED · Alto-Shaam waste survey · Produce Blue Book · The Packer · USDA AMS market news · Stripe support docs on sole-proprietor signup and Payment Links · Stripe pricing · WA DOR business licensing and digital products · Sales Tax Institute on ESSB 5814
