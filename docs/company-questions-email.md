# 发给公司的 Guideline 确认邮件（草稿）

**To**: Production@gmccloan.com
**Cc**: mlaw@gmccloan.com
**Subject**: Universe V14 guideline clarification — 6 questions

> 只发以下 6 个核心问题。其余差异已在系统内按双口径 / 保守默认处理，不需要占用 product desk 时间。

---

Hi Production team,

I'm reconciling the Universe V14 deck (03-02-2026 cover, 04-05-2026 file) for my intake checklist and found a few places where pages give different numbers. Could you confirm the following?

**1. LTV matrix.** Page 14 (Effective 03-02-2026) shows max LTV/CLTV/HLTV 60% for Primary, 2nd Home AND Investment, for Purchase, R/T AND C/O. But page 6 shows Investment/Cash-out at 50%, page 32 shows regular cash-out max 50%, and the Investment reserve table on page 25 only covers LTV up to 50%. Could you give the full current matrix — Primary Purchase / Primary R/T / Primary Cash-out / 2nd Home Purchase & Refi / Investment Purchase / R/T / Cash-out? If Investment can now go to 60%, how do reserves work for LTV 50.01–60%?

**2. DTA total assets definition.** Page 21 uses subject market value per appraisal and deducts "assets used to purchase subject property"; the page 20 example uses purchase price and deducts down payment + closing costs; page 12 says purchase price or appraisal, whichever is LOWER; page 19 says "after cash to close". Which basis and which deduction should we use? Also, for the auto offsetting asset/liability (p19/p20): should the vehicle asset be entered at actual FMV, at the loan balance amount, or another prescribed value?

**3. Investment DSCR / reserve matrix.** Page 22 text and the page 25 table differ (and the page 25 text below the table says "no reserve if DSCR >= 1%" — is that a typo for 1.00?). Is the 45% boundary <45% or ≤45%? Which version governs, and what are the reserve requirements at DSCR ≥1.20 vs ≥1.00?

**4. Large deposit threshold.** Pages 9 and 26 say the threshold is 6 months PITIA; page 42 says "100% of pitia" for personal bank accounts. Which one applies?

**5. Mexico foreign national.** Page 2 says "Borrower from Mexico may ok by investor exception"; page 35 says "will NOT be eligible-by exception". Can we take these files? If yes — is a written exception required before opening the file or after submission, and are there state/county restrictions beyond TX SB 17?

**6. Gift donor statements.** Page 27 says gift must be in borrower's account or escrow prior to CTC, otherwise 1 month of donor statements; page 43 says into title before docs, otherwise 2 months. Which timing and how many months? (We're collecting 2 months / before docs as a conservative default in the meantime.)

Thanks!

---

**回复后操作**：把答案逐条写入 `products/universe-v14/policy-overrides.json` 对应的 `OVR-PENDING-*` 占位（补 `resolution`、`confirmedBy`、`confirmationDate`、`effectiveDate`，status 改 `confirmed`），rule engine 即自动采用最终口径，无需改代码。
