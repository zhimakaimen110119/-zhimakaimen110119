# Phase 2 — 架构、Schema、Rule Engine、计算器与 UI 设计

状态：待你确认后进入 Phase 3。
前提：Phase 1 修订已完成（三层规则架构、6 项核心冲突、9 项 confirmed override + 2 项 operational default）。

---

## 1. 项目架构

```
loan-intake-copilot/
├── app/
│   ├── layout.tsx                # 全局布局 + PII 警示横幅
│   ├── page.tsx                  # 主页面（输入 + 结果，单页应用式）
│   └── globals.css
├── components/
│   ├── CaseInputForm.tsx         # 自由文本 + 结构化字段
│   ├── PiiWarning.tsx
│   ├── ResultTabs.tsx            # 11 个结果分区
│   ├── RuleFindingCard.tsx       # 单条规则判定卡片
│   ├── CalcBreakdown.tsx         # 计算过程展开
│   ├── DualScenario.tsx          # 双口径并排展示
│   └── CopyButtons.tsx           # Copy All / Chinese / Internal LO
├── lib/
│   ├── schema/case.ts            # Zod 数据模型（§3）
│   ├── pii/guard.ts              # PII Guard（§7）
│   ├── parser/heuristic.ts       # 确定性 NL 解析（无 AI 依赖，§4）
│   ├── rules/
│   │   ├── types.ts              # Rule / Conflict / Override 类型
│   │   ├── load.ts               # 三层加载 + override 合并（§5.1）
│   │   ├── engine.ts             # 条件求值（§5.2）
│   │   └── caseConflicts.ts      # 客户数据冲突检测（§5.4）
│   ├── calc/
│   │   ├── money.ts              # 整数分运算，禁止浮点金额
│   │   ├── ltv.ts  dta.ts  dscr.ts  reserves.ts
│   │   ├── largeDeposit.ts  postClosing.ts
│   │   └── types.ts              # CalcResult<T>（§6.1）
│   ├── questions/
│   │   ├── consolidate.ts        # 缺失字段 → 合并问题（§8）
│   │   └── templates.ts          # 中文问题模板（8 个分类）
│   └── encompass/summary.ts      # Encompass Entry Summary 生成
├── products/universe-v14/
│   ├── source-rules.json         # 146 条不可变原文规则
│   ├── conflicts.json            # 6 核心 + 3 次要 + 记录
│   └── policy-overrides.json     # 人工确认口径
├── fixtures/                     # synthetic 测试案例（15 个）
├── tests/                        # vitest
└── docs/
```

**原则**：无数据库、无登录、无 API key 也可完整运行（AI 解析为可选增强，默认走确定性解析器）；所有状态仅存内存，刷新即清空；不写 localStorage、不写日志、无 analytics。

---

## 2. Pipeline

```
输入文本/表单
  → 1. PII Guard（block/warn，block 时不进入后续步骤）
  → 2. Parser（确定性正则/词典解析；AI 可选，仅做字段抽取，输出仍过 Zod）
  → 3. Normalize（枚举归一、金额转分、州/county 归一）
  → 4. Rule Engine（146 条规则 × override 合并后求值）
  → 5. Calculators（6 个确定性计算器，双口径）
  → 6. Case-data conflict detection
  → 7. Missing-info detection（规则 requiredFields ∪ 计算器 missing）
  → 8. Question consolidation（借款人问题；guideline 冲突只进 LO 面板）
  → 9. Render（11 个分区）
```

AI 的边界（与你的要求一致）：只做 ①自然语言→字段 ②缺失字段合并成人话 ③措辞润色。规则判断、hard stop、全部金额运算只在 TypeScript 里发生。AI 输出一律过 Zod 校验，解析失败回退到确定性解析器。

---

## 3. 数据 Schema（Zod，节选签名）

所有金额字段单位为 **美分（整数）**；未知一律 `undefined`（绝不默认 0）。

```ts
const Money = z.number().int().nonnegative();        // cents
const Pct   = z.number().min(0).max(100);

const TransactionSchema = z.object({
  purpose: z.enum(["purchase","rate_term_refinance","cash_out_refinance","delayed_financing"]).optional(),
  occupancy: z.enum(["primary","second_home","investment"]).optional(),
  state: z.string().length(2).optional(),
  county: z.string().optional(),
  purchasePrice: Money.optional(),
  propertyValue: Money.optional(),          // estimated / appraisal
  requestedLoanAmount: Money.optional(),
  cashOutAmount: Money.optional(),
  cashOutPurpose: z.string().optional(),
  loanProgram: z.enum(["fixed_30","fixed_15","arm_10_1","arm_7_1","arm_5_1"]).optional(),
  noteRate: z.number().optional(),
  armIndexValue: z.number().optional(),     // LO 输入当期 1yr CMT（OVR-002）
  armIndexDate: z.string().optional(),
  qualifyingRateOverride: z.number().optional(),
  monthlyPITIA: Money.optional(),           // LO 手动输入（OVR-001）
  subordinateLienBalance: Money.optional(),
  subordinateLienLimit: Money.optional(),   // AMB-004 双口径
  priorPurchaseClosingDate: z.string().optional(),
  applicationDate: z.string().optional(),
  usePOA: z.boolean().optional(),
  vestingType: z.enum(["individual","trust","business"]).optional(),
});

const BorrowerSchema = z.object({
  citizenshipStatus: z.enum(["us_citizen","permanent_resident","non_permanent_resident","foreign_national"]).optional(),
  countryOfOrigin: z.string().optional(),
  visaType: z.string().optional(),
  fico: z.number().int().min(300).max(850).optional(),
  age: z.number().optional(),               // 退休金 59½ 分档（OVR-004）
  creditEvents: z.object({ bankruptcy: …, foreclosure: …, monthsSince: … }).optional(),
  mortgageLates: z.object({ x30in12: …, x60in12: …, x90in12: … }).optional(),
  otherLates:   z.object({ x30in12: …, x60in12: …, x90in12: …, over90: … }).optional(),
  numberOfBorrowers: z.number().int().optional(),
  hasSSN: z.boolean().optional(), hasITIN: z.boolean().optional(),
  legallyInUS: z.boolean().optional(),
});

const EmploymentSchema = z.object({
  currentEmploymentStatus: z.enum(["employed","self_employed","retiree","homemaker","student","not_employed"]).optional(),
  employerOrBusinessName: z.string().optional(),
  occupationOrBusinessType: z.string().optional(),
  selfEmployed: z.boolean().optional(),
  ownershipPercent: Pct.optional(),
  businessCountry: z.string().optional(),   // Exhibit C offshore（OVR-006）
  startDate: z.string().optional(),
  employmentHistory24Months: z.boolean().optional(),
  sourceOfWealth: z.string().optional(),
});

const AssetsSchema = z.object({
  personalBank: Money.optional(), businessBank: Money.optional(),
  stocks: Money.optional(), retirement: Money.optional(),
  retirementAccessible: z.boolean().optional(),      // OVR-004: pension 不可用
  foreignBank: Money.optional(), trustFunds: Money.optional(),
  trustRevocable: z.boolean().optional(),
  lifeInsuranceCashValue: Money.optional(),
  tangibleAssets: Money.optional(),
  giftFunds: Money.optional(), giftOfEquity: Money.optional(),
  giftDonors: z.array(z.object({
    relationship: z.string().optional(),             // OVR-007: 必须为亲属
    country: z.string().optional(),                  // Exhibit A 检查
    fromBusinessAccount: z.boolean().optional(),
    donorOwnershipPercent: Pct.optional(),
  })).optional(),
  borrowedFunds: Money.optional(),
  cryptoConvertedToUSD: Money.optional(),
  cashToClose: Money.optional(), postClosingAssets: Money.optional(),
  largeDeposits: z.array(z.object({ amount: Money, description: z.string().optional(), month: z.string().optional() })).optional(),
});

// LiabilitiesSchema / REOSchema / PropertySchema 按任务书字段，另加：
// REO: isSubject, country, rentSource("lease_with_reasonability"|"broker_estimate"|"appraisal_rent_schedule"), vacant
// Property: unpermittedArea
```

`LoanCase = { transaction, borrower, employment, assets, liabilities, realEstateOwned[], property, rawText }`

---

## 4. 确定性解析器（无 AI 依赖）

`parser/heuristic.ts`：正则 + 词典。识别：金额（$1.5M / 700K / 950k）、州缩写与全名、FICO（3 位数上下文）、occupancy 关键词（primary/second home/investment/rental）、purpose（purchase/cash-out/refi）、身份（green card/permanent resident/citizen/F1/H1b/foreign national）、自雇（self-employed/owner + 年限 + 持股%）、资产类别词（checking/savings/retirement/401k/stocks）、REO 描述（owns a rental worth X with Y mortgage）、gift（no gift funds / gift from …）。
每个抽取值携带 `source: "text" | "form"`；表单字段优先于文本抽取；两者矛盾时进入 case-conflict 而不是覆盖。

---

## 5. Rule Engine 设计

### 5.1 三层加载与合并（load.ts）

```
sourceRules(146)
  ⊕ overrides(status ∈ {confirmed, operational_default})   // 按 supersededRuleIds 替换/注入
  − legacy_orphan / reference_example                        // 不参与判定，进 Guideline Sources
  → executableRules
conflicts.coreConflicts / minorPending → scenarioDefs        // 双口径参数
```

优先级：`confirmed override > operational_default override（带标注）> active source rule`。
`conflicted` 规则不单独求值，由所属 conflict 的 `scenarios` 驱动双口径计算。

### 5.2 条件求值（engine.ts）

- 条件 DSL 即 source-rules.json 中的 `{field, op, value}`，AND 语义，`anyOf` 支持 OR。
- **Unknown 三态**：任一 `field` 缺失 → 该规则输出 `insufficient_data`，缺失字段进入 missing 集合；绝不把缺失当 false。
- 每条判定输出：`{ ruleId, outcome: pass|fail|insufficient_data|manual_confirmation, severity, resultType, usedFields: {path: value}, missingFields[], sourcePages[], sourceText, overrideApplied? }`。

### 5.3 双口径（DualScenario）

conflict 的每个 scenario 生成一套参数注入计算器/规则，结果并排展示：

```
LTV 46.7%
  Scenario p14 (60% cap): PASS
  Scenario p6/p32 (50% cap): PASS
LTV 53.3%
  Scenario p14: PASS  |  Scenario p6/p32: FAIL
  → Manual Confirmation Required（CONF-001，附两页原文）
```

两口径结论一致时正常给结论（仍注明按哪两个口径都成立）；不一致才升级为 Manual Confirmation Required。

### 5.4 客户数据冲突检测（caseConflicts.ts）

固定检查清单（每项输出：冲突内容、数据来源、原因、需 LO 确认的问题）：
- purpose 文本 vs 表单不一致（如文本说 cash-out、表单选 purchase）
- occupancy 同时出现 primary 与 investment 线索
- propertyValue 为 0/缺失但有 loanAmount
- loanAmount > 产品上限（$3M / 分层 $2M）
- citizenshipStatus 与 visaType 矛盾（如 us_citizen + F1）
- purchase 却有 cashOutAmount；refinance 却有 purchasePrice 无现值
- selfEmployed=false 但有 ownershipPercent/businessBank
- state 与 county 不匹配（county 词典按州校验）
- giftFunds>0 但 giftDonors 为空（提示补赠与人信息，不算硬冲突）

---

## 6. 计算器设计（全部纯函数、整数分）

### 6.1 统一返回结构

```ts
type CalcResult<T> = {
  status: "ok" | "insufficient_data" | "manual_confirmation";
  scenarios: Array<{ key: string; label: string; value?: T;
                     breakdown: Record<string, number|string>;  // 每个组成项
                     guidelineLimit?: number; passes?: boolean }>;
  inputsUsed: Record<string, unknown>;
  missing: string[];
  excluded?: Array<{ item: string; reason: string; sourcePage: number[] }>; // 如不可作 reserve 的资金
  notes: string[];                                              // operational default 标注等
};
```

### 6.2 LTV（ltv.ts）
- 分子：requestedLoanAmount；CLTV 加 subordinateLienBalance；HLTV 加 subordinateLienLimit（AMB-004 双列）。
- 分母 scenarios：purchase 案 → `purchase_price` / `appraisal` / `lower_of`（CONF-002 相关）；refi 案 → propertyValue。
- 上限 scenarios：CONF-001 的 p14_unified_60 / p6_p32_split。
- 显示：使用的 loan amount、使用的 value、结果、缺失数据。

### 6.3 DTA（dta.ts）
- 仅 primary / second_home（investment 显式输出 "not applicable, DSCR product"）。
- Debts（两口径基本一致，直接实现）：新贷款额 + 全部 REO 贷款余额 + installment + revolving + collections + liens + chargeOffs；refi 减 subject 现有留置权（p21）；lease 不计（p29）。
- Assets scenarios：CONF-002 的三口径（p20_example / p21_table / p12_lower）；组成项逐行展示：各 REO（× ownership%）、bank、stocks、retirement（OVR-004 100% if accessible）、foreignBank、trust（revocable）、lifeInsurance、crypto（已变现）、business（× ownership%）、gift（计入，p27）、borrowed（计入，p43）、tangible net value；扣减项按 scenario。
- 车辆：按 offsetting 处理；取值基准未决 → 有车贷输入时输出 note + 双口径（余额同额 / FMV）。
- 输出：total debts、total assets、每个组成项、cash-to-close deduction、ownership 调整、最终 DTA、60% 上限、缺失数据。

### 6.4 DSCR（dscr.ts）
- 仅 investment。qualifying rent：按 rentSource 三选一；`lease_with_reasonability` 需要 stated 与 reasonability 两个数取低。
- **无租金数据：不估算**，输出 insufficient_data + 按 no-ratio 档展示 reserve 后果（AMB-003 注明依据）。
- DSCR = qualifyingRent / monthlyPITIA（PITIA 来自 LO 输入，OVR-001）。
- 显示：qualifying rent、PITIA、DSCR、租金来源、（如适用）refi 空置 → manual review（UNI-DSCR-008）。

### 6.5 Reserve Months（reserves.ts）
- required：primary/2nd 按 FICO 700 分档（12/18 个月，liquid 下限 6/12）；investment 按 CONF-005 双口径。
- eligible liquid：bank + stocks + foreignBank + revocable trust + lifeInsurance + crypto(已变现) + business(×own%) + retirement(OVR-004 年龄分档)。
- eligible non-liquid：REO net equity（US+Foreign）+ auto/boats/bullion + retirement 100%。
- **excluded 明细**（必须展示）：giftFunds（p24 等 7 处）、giftOfEquity（p28）、borrowedFunds（p43）、cash-out proceeds（除 CONF-005 例外档，双口径）。
- actual months = eligible / monthlyPITIA；缺 PITIA → insufficient_data。

### 6.6 Large Deposit（largeDeposit.ts）
- 双阈值（OVR-010）：`1 × PITIA` 与 `6 × PITIA` 并排，各自命中的存款清单。
- Pattern 检测（p9/p40/p42 规则）：单月多笔合计超阈值；跨月递增凑 reserve；描述含人名（疑似 gift）→ 标 "needs review"。
- Final sourcing requirement 一律显示 Manual Confirmation Required（CONF-009 未决期间）。

### 6.7 Post-closing Assets（postClosing.ts）
- 总可用资产 − down payment − closing costs − 其他 required cash to close。
- 标注：PDF 无官方算式（依据 p19/p21 的扣减逻辑），结果同时供 reserve 计算使用。

---

## 7. PII Guard 设计

运行时机：Analyze 前，纯客户端，不发送、不记录。

| 检测 | 模式 | 动作 |
|---|---|---|
| SSN | `\d{3}-\d{2}-\d{4}`；9 连续数字 + SSN/social 上下文 | **block** |
| DOB | 日期 + DOB/birth/生日 上下文；`\d{1,2}/\d{1,2}/(19|20)\d{2}` 全格式 | **block** |
| 银行账号 | 8–17 位数字 + account/acct/账号 上下文 | **block** |
| Routing | 9 位数 + ABA checksum 通过，或 routing 上下文 | **block** |
| Encompass loan # | `\b\d{10,13}\b` + loan #/loan number 上下文 | **block** |
| 完整住宅地址 | 门牌号 + 街道后缀（St/Ave/Dr/Blvd…）+ 城市/ZIP | **warn**（建议改为城市/county） |
| 信用报告片段 | tradeline 表格特征词组合 | **warn** |
| 姓名+敏感财务 | 词典外人名启发式 + 金额/账户共现 | **warn** |

block：阻止分析并高亮命中片段；warn：允许继续但要求勾选 "I confirm this is synthetic/de-identified"。页面顶部固定横幅：**Do not enter real borrower PII. Use synthetic or de-identified information only.**

---

## 8. 问题生成设计

1. 收集：所有 `insufficient_data` 的 missingFields + 计算器 missing + case conflicts 中需要客户澄清的项。
2. 过滤：已提供的字段不再问；**guideline 内部冲突（CONF-*）绝不生成 borrower 问题**，只进 LO 面板。
3. 合并：按字段组映射到问题模板（如 REO 的 4 个缺失字段 → 1 个"请列出名下所有房产…"问题）。
4. 排序：①改变资格的（州/county、身份国别、行业、FICO、信用事件）②计算必需的（价值、贷款额、PITIA、租金、资产明细）③文件与细节（对账单、gift letter、LOE）。
5. 输出三版：客户中文版（自然、专业、可直接复制，术语带英文括号）、客户英文版、Internal LO 版（含 rule ID、页码、为什么问）。

分类固定为任务书的 8 类：交易与房产 / 身份与居留 / 工作与业务 / 信用与负债 / 其他房产 / 资产与 reserves / Gift funds 与 large deposits / 产品特有问题。

---

## 9. 结果页 UI Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│ ⚠ Do not enter real borrower PII. Synthetic cases only.      │
├──────────────────────────────────────────────────────────────┤
│ Product: [Universe V14 ▾]     [Sample Case] [Clear Case]     │
│ ┌──────────────────────────────┐ ┌─────────────────────────┐ │
│ │ Free-form case input         │ │ Structured (optional)   │ │
│ │ (textarea, 10 rows)          │ │ Purpose  [▾] State [▾]  │ │
│ │                              │ │ Occupancy[▾] County[▾]  │ │
│ │                              │ │ Price $__ Value $__     │ │
│ │                              │ │ Loan  $__ FICO ___      │ │
│ └──────────────────────────────┘ │ PITIA $__ (LO input)    │ │
│            [ Analyze Loan ]      └─────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Tabs: Summary│Confirmed│Conflicts│Missing│Eligibility│       │
│       Questions│Docs│Calc│Encompass│Sources│Guideline ⚠     │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ [Calculations 示例]                                       │ │
│ │ LTV — 46.7%                                              │ │
│ │  loan $700,000 / value $1,500,000                        │ │
│ │  ├ Scenario p14 (cap 60%)      PASS                      │ │
│ │  └ Scenario p6/32 (cap 50%)    PASS                      │ │
│ │ Reserves — need 12 mo (FICO 720 ≥700) [p24] UNI-RES-001  │ │
│ │  eligible liquid $300,000 · excluded: gift $0 …          │ │
│ │  actual: insufficient_data — missing monthlyPITIA        │ │
│ │ Large deposit thresholds: 1-mo $X | 6-mo $Y              │ │
│ │  Final sourcing requirement: Manual Confirmation Req.    │ │
│ └──────────────────────────────────────────────────────────┘ │
│ [Questions tab] ── [Copy All] [Copy 中文] [Copy Internal LO]  │
└──────────────────────────────────────────────────────────────┘
```

每条规则判定卡片：结论 · severity 色条 · PDF page · rule ID · 使用的客户数据 · 是否需人工确认 · （override 时）"per OVR-xxx / operational default" 标签。

Encompass Entry Summary：Borrower / Transaction / Subject Property / Employment / Assets / Liabilities / REO / Declarations / Product-specific notes 九个板块，未知值一律 `Not Provided`。

---

## 10. 测试计划（映射任务书 15 项）

| # | 场景 | 断言要点 |
|---|---|---|
| 1 | Primary purchase 信息完整 | 无 missing；双 LTV 口径同 PASS；DTA 三口径均出数 |
| 2 | Primary cash-out 缺 property value | LTV/DTA insufficient_data；问题清单含估值问题；TX 外州 |
| 3 | Purchase 与 cash-out 冲突 | caseConflicts 命中 purpose 冲突 |
| 4 | Investment DSCR 缺 rent | DSCR insufficient_data，不估算；按 no-ratio 档展示 reserve |
| 5 | FICO 665 | UNI-CREDIT-002 管理层批准 + 18 个月 reserve + 未量化备注 |
| 6 | FN from Vietnam (F1) | UNI-BOR-004 hard stop；FN from Mexico → CONF-014 manual confirmation |
| 7 | Massage parlor owner | UNI-EMP-008 hard stop |
| 8 | Casino owner vs casino employee | owner fail (Exhibit C)、employee pass |
| 9 | Gift 计入 reserves | reserves.excluded 含 gift，actual months 不含 gift |
| 10 | Business funds 60% 持股 | 按 60% 折算 + access letter 文件项 + CPA letter（K1 不足） |
| 11 | Large deposit pattern | 双阈值展示；pattern 命中；Manual Confirmation Required |
| 12 | LTV 53% investment | 双口径分歧 → Manual Confirmation Required（CONF-001） |
| 13 | DTA 缺资产数据 | insufficient_data + missing 列表，不猜测 |
| 14 | 完整 synthetic Universe case | 端到端：11 分区全渲染，Encompass summary 未知项=Not Provided |
| 15 | PII Guard | SSN/DOB block；地址 warn；synthetic 勾选流程 |

Fixtures 全部为虚构人物（如 "Test Borrower A"），金额取整，不含任何真实 PII。

---

## 11. Phase 3 交付内容

1. 可运行 MVP（`npm i && npm run dev`，无需任何环境变量）
2. 上述 15 项 vitest 测试
3. Sample Synthetic Case 按钮（内置任务书示例 WA cash-out case）
4. 本地运行说明（README 增补）

**请确认本设计后我开始 Phase 3。** 两个可选项请顺带表态（默认按推荐执行）：
- AI 解析：默认 V1 只用确定性解析器（无外部调用、零泄露面）；如要接 Claude API 做自然语言解析，我会加 `ANTHROPIC_API_KEY` 可选配置，无 key 时自动降级。**推荐：V1 纯本地。**
- 结果页布局：默认 Tabs（11 区）；也可改单页长滚动分区。**推荐：Tabs。**
