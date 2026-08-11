# Phase 1 — 需要你人工确认的问题清单

说明：以下问题全部来自 PDF 内部的冲突或定义缺口。**在你回答之前，rule engine 不会替这些问题选择答案**，只会输出 `Manual Confirmation Required` 并同时展示冲突双方原文与页码。

优先级：**A = 阻塞 Phase 3 的核心计算**；**B = 影响资格判定但可先双口径并行**；**C = 影响文件清单或措辞**。

---

## A 组 — 阻塞核心计算（建议优先回答）

### A1. 最高 LTV 到底是 60% 还是 50%？（CONF-001）

| 页 | 原文 |
|---|---|
| 14 | Effective on 03-02-2026: Max LTV/CLTV/HLTV – 60% for Primary & 2nd Home & **INVESTMENT** / 60% for Purchase, R/T & **C/O** |
| 6 | LTV: Primary/2nd -60%, **investment /C/O: 50%** |
| 32 | Delayed Financing – max 60% for primary, **Cash out – max at 50%** |
| 25 | Investment Loans 表格 Maximum LTVs: **45.01-50% / Up to 45%** |

**请确认**：
1. 第 14 页 03-02-2026 的 60% 是否已 supersede 第 6、25、32 页？
2. 若否，请分别给出：primary purchase / primary C/O / 2nd home / investment purchase / investment C/O 的最高 LTV。
3. 第 25 页的投资房 Option 表是否仍然有效（该表最高只到 50%）？

---

### A2. DTA 的 Total Assets 按哪个版本算？（CONF-002 / CONF-003 / CONF-004）

三个版本互不相同：

| 来源 | subject 取值 | 扣减项 | 其他 REO |
|---|---|---|---|
| 第 19 页 | 未明确 | 扣 cash to close | Zillow 估值 × 持股% |
| 第 21 页表格 | appraisal 市值 | purchase 时扣「用于购买 subject 的资产」；refi 不扣 | 已核实资产（按持股%调整） |
| 第 20 页示例 | purchase price $2m | 扣 down payment $800k + closing cost $15k | Zillow $1m |

**请确认**：
1. Total Assets 以第 19、20 还是第 21 页为准？
2. subject property 取 appraisal 市值、purchase price，还是第 12 页说的「取低」？
3. 扣减项是 cash to close 全额，还是仅 down payment（不含 prepaid、escrow 等）？
4. **车贷**：按第 19 页抵消（两边都不计），还是按第 20 页示例两边都计入？

> 第 20 页示例复核：2,000,000 + 1,000,000 + 950,000 + 70,000 + 20,000 − 800,000 − 15,000 = 3,225,000；1,200,000 + 700,000 + 20,000 + 5,000 = 1,925,000；1,925,000 / 3,225,000 = 59.69%。数字本身自洽，但车贷 20,000 同时出现在资产与负债两侧，与第 19 页的抵消规则矛盾。

---

### A3. 投资房 reserve 与 DSCR 门槛以哪一页为准？（CONF-005）

| 页 | 内容 |
|---|---|
| 22 | DSCR ≥1.2 → 6 个月 liquid；DSCR <1.2 或 no ratio → 12 个月（6 liquid + 6 non-liquid）；LTV<45% 时 cash out proceeds 可作 reserve，**DSCR>1 则免 reserve** |
| 25 表格 | LTV 45.01-50%：Option A 120% DSCR + 6 个月 liquid ｜ Option B 12 个月（≥6 liquid）<br>LTV ≤45%：Option A 100% DSCR **免 reserve** ｜ Option B 6 个月（≥3 liquid 或 subject cash proceeds） |
| 25 文字 | LTV <45%：**DSCR >= 1% 免 reserve**；DSCR < 1% 则 6 个月，其中 3 个月 non-liquid 可来自 cash out proceeds，借款人需 3 个月 liquid |

**请确认**：
1. 以第 22 页文字还是第 25 页表格为准？
2. 第 25 页的「DSCR >= 1%」是否应读作 **DSCR >= 1.00（即 100%）**？（系统不会自行修正笔误）
3. LTV 恰好 = 45.00% 时按哪一档？（第 6 页写 `<=45%`，第 22 页写 `<45%`）

---

### A4. PITIA 如何构成？（AMB-001 / AMB-002）

PDF 全文以 PITIA 作为 reserve 月数与 large deposit 阈值的基数，但**从未定义 PITIA 包含哪些项、税金与保险如何取值**。

**请确认**：
1. PITIA = 本金 + 利息 + 地税 + 保险 + HOA？（是否含 Mello-Roos / 特别税）
2. 地税按什么口径估（purchase price × 税率？appraisal？实际税单？）
3. ARM 案子的 P&I 按 qualifying rate（第 24 页要求）计算 —— 确认无误？

在你回答前，Phase 3 的 PITIA 将 **要求 LO 手工输入**，不做任何估算。

---

### A5. ARM 的 index 用哪个？（CONF-012）

第 15 页：`3.79% as of 06-14-2026`；第 44 页：`Rate Index Base Value 3.59% [Weekly CMT]`。

**请确认**：ARM 案子是否一律要求 LO 手工输入当期 1 yr CMT？（默认方案：是，系统不内置固定 index）

---

## B 组 — 影响资格判定

### B1. Large deposit 阈值是 6 个月还是 1 个月 PITIA？（CONF-009）
第 9、26 页写 `6 months PITIA`，第 42 页写 `100% of pitia`。差 6 倍，直接决定要让客户解释多少笔存款。

### B2. NY 是否可以放款？（CONF-013）
第 22 页有 NY 专属 DSCR 条款，但第 7 页放款区域不含 NY。该条是否为旧版残留？

### B3. 墨西哥籍 Foreign National 是否可做？（CONF-014）
第 35 页：`will NOT be eligible-by exception`；第 2 页：`may ok by investor exception`。是否可受理？走什么流程？

### B4. $2M–$3M 的案子是否仍需走第 3 页的 exception 流程？（CONF-011）

### B5. 退休金作为 liquid reserve 计 100% 还是 70%？（CONF-010）
第 26 页按 59½ 岁分档，第 42 页按用途分档且不看年龄。59½ 以上的借款人两页结论不同。

### B6. FICO <680 时，除 18 个月 PITIA 外是否另有加码？（CONF-015）
第 8 页要求「lower LTV + more reserve」但未量化；第 24 页只按 700 分档。
另请确认：**多借款人时 FICO 取最低分、主借款人还是中位数？**（AMB-008）

### B7. 在美国 / 中国 / 香港 / 台湾以外经营业务的自雇借款人是否一律不合格？（CONF-017）
第 39 页示例：加拿大 FN 在加拿大有公司 → 不可；中国 FN 在中国有公司 → 可以。第三国（如新加坡、日本）如何处理？是否可申请例外？

### B8. 无贷款的境外房产可否主动计入 DTA？（CONF-018）
第 19 页说「free and clear 可不计入」—— 是允许省略还是禁止计入？同一处房产净值能否同时用于 DTA 与 non-liquid reserve？

### B9. CLTV / HLTV 中的次级留置权按余额还是授信额度计算？（AMB-004）

### B10. 投资房的 refinance 能否使用 gift funds？（CONF-021）
第 27 页写 `Investment purchase`，第 2、6 页未限定交易类型。

---

## C 组 — 影响文件清单与问题措辞

### C1. Gift 赠与人对账单要 1 个月还是 2 个月？存入时点以 CTC 还是 doc 为准？（CONF-007）
默认方案：向客户提问时按较严口径（2 个月）提示，同时标记待确认。

### C2. 赠与人是否必须为亲属？（CONF-008）
只有第 43 页提到 `Donor must be a relative`。非亲属赠与是否一律不可？

### C3. Exhibit A 对 gift 的国别限制按什么判断？（AMB-007）
按赠与人国籍、居住地，还是汇出账户所在国？

### C4. Business funds 持股证明确认只接受 CPA letter / article of incorporation，不接受 K1 与税表？（CONF-016）

### C5. 2-4 units 自住时，其他单元租金如何处理？（AMB-005）

### C6. Departing residence 已挂牌或已签买卖合同时，DTA 中如何处理？（AMB-006）

### C7. Trust 名下房产在 DTA 中如何按 ownership % 折算？（AMB-009）

### C8. Rate/Term refinance 是否有独立于 purchase 的 LTV 上限？（AMB-010）

---

## 附：本阶段已确认无冲突、可直接实现的部分

以下规则在 PDF 内多处一致，Phase 2/3 会直接实现，**不需要你逐条确认**（如有异议请指出）：

- 6 州 37 county 清单（第 7 页）
- TX 三项限制：无 primary C/O 与 R/T、50a6 与 delayed financing 不可、China 的 FN/NPRA 不可
- Exhibit A 86 国清单 + 「US citizen 与绿卡不适用」的适用范围
- Exhibit B（业主 + 员工均不合格）与 Exhibit C（业主不合格、员工可以）的完整清单
- Massage 相关 hard stop（含网站/Yelp 提及）
- 信用容忍度：1x30x12（房贷）、3x30x12 / 2x60x12 / 1x90x12（其他）、>90 天不合格、重大信用事件 1 年
- Primary/2nd reserve 分档：≥700 → 12 个月（≥6 liquid）；<700 或无分 → 18 个月（≥12 liquid）
- Gift：最多 3 位赠与人（NO EXCEPTION）、不可作 reserve、不可来自 Exhibit A 国家、donor business 需 100% 持股
- Gift of equity：仅 purchase、可作首付与费用、不可作 reserve
- 资产逐类处理（第 26、42、43 页共 13 类）
- 房产类型与 ≤10 acres、appraisal + CDA、transferred appraisal
- 文件类：W-8、condo cert、access letter、CPA letter、Source of Wealth LOE、Cash-out purpose LOE、签名一致性、EPO addendum
