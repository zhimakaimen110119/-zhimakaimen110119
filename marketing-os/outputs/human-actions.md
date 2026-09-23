# Human actions required — ONE batch

Updated 2026-08-18, after market resolution, prospecting and content generation.

**Two things need you. Everything else is done and needs no approval.**

---

## 1 · Verify the businesses are still open (~30 min)

**This is not optional and I cannot do it.** Neither prospecting agent could open a single business page — the sandbox egress proxy blocks WebFetch for every external domain. All addresses and phone numbers came from search-result summaries, not from the businesses' own pages.

Between them the two agents hit **14 permanently closed Chinese businesses** in this metro in one afternoon, several of them institutions (Harbor City, Shanghai Garden, Mon Hei, A Bite of Sichuan, Regent Bakery Redmond). That is a brutal churn rate.

Open `campaigns/campaign-002/prospects/ranked.md`, work down the top 20, confirm each is open. Two are flagged and must be resolved first:
- **U Lin Asian Bistro** — shares an address with Mount & Bao; one may have replaced the other (`verify_open`)
- **Great China Restaurant** — listings disagree on Kirkland vs Redmond Way (`verify_city`)

## 2 · Send the 20 messages (~45 min)

`campaigns/campaign-002/content/outreach-top20.md` — 20 messages, each opening on a documented detail about that specific business. Attach `content/chushu-pack-pnw-v1.md`.

**No approval needed.** Zero-cost outreach to public business contacts is AUTO under approval-policy v2 rule A15.

Before the first send, create one Stripe Payment Link for **"节气 Pack — one pack, $49."** When someone asks how to pay, you send the link in that message, not the next one.

处暑 is Aug 23 — five days out. The free pack is only current until Sept 6.

---

## Not asked for, on purpose

**Platform logins.** Still withheld. The Judge ranked 小红书 5th, 7th and 10th of eleven, all with disqualifiers, and the Feb 2026 digital-goods gate (1,000 followers / 180 days / 30 notes / ¥6,000 monthly GMV) means a new account cannot legally sell there for six months. Nothing in the US campaign needs a single social account.

**The ten店名 you declined to supply.** Correctly declined — the agents found 65 and scored them.

---

## Open items that block scaling, not the first sale

| # | Item | Blocks | Owner |
|---|---|---|---|
| L1 | **WA ESSB 5814** broadened retail sales tax to digital automated services and removed the "human effort" exclusion (eff. Oct 1 2025). Whether a paid seasonal report falls inside is unresolved. | Any published price list. Not a $49 test. | A WA CPA. Not resolvable by research, and not something I should answer. |
| L2 | WA DOR business licence threshold — $12,000/yr gross, among other triggers | Sustained revenue | You, via the DOR page |
| MC-01 | **The product itself is still unreachable.** `shilingshipu.com` returns 403 from the sandbox proxy; no repo on this account. No product audit has been performed and none was invented. | Any claim about what the site does | Run this on the machine with the code, or push the repo here |
| MC-02 | No analytics confirmed on the site | All UTM attribution | You |

Note on MC-01: campaign-002 routes around it deliberately. The pack is the product for this test, delivered as a PDF. Nothing in the first sale depends on the website working.

---

## The gap worth knowing about

**私房菜 / WeChat-group meal-prep / 社区团购 operators could not be found.** Two agents, working independently in different territories, ran nine discovery angles between them in Chinese and English. Both concluded the same thing: these operators advertise inside closed WeChat groups and 小红书, which web search does not index.

Two independent agents converging makes this a finding, not a failure. **This segment is plausibly the best-fit buyer of all** — smallest, most produce-sensitive, most caption-hungry — and reaching it needs a human with WeChat access, not another agent. If you are in any Seattle-area Chinese food or grocery WeChat groups, that is a channel no agent here can open.
