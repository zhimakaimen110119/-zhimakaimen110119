# Phase 1 — Guideline Extraction Report

**产品**：GMCC Universe（In House Underwrite）
**来源文件**：`GMCC Universe V14 04-05-2026.pdf`（共 44 页 / 幻灯片）
**抽取日期**：2026-08-11
**状态**：草稿，等待人工确认后进入 Phase 2

---

## 0. 抽取方法与可信度

| 项目 | 说明 |
|---|---|
| 读取方式 | 44 页全部逐页读取，采用「文本层提取 + 页面渲染图像」双通道核对 |
| 表格处理 | 第 21、24、25、35、36、37、44 页为图片表格，均按渲染图像逐格核读，未依赖文本层 |
| 抽取原则 | 只结构化 PDF 原文；**不引入任何 PDF 之外的行业惯例或常识补充** |
| 冲突处理 | 一律不静默选择答案，标记 `status: conflicted` + `manualConfirmationRequired: true`，并写入 conflicts 文件 |
| 结果 | **146 条规则**，其中 **24 条标记为 conflicted**；**22 项规则冲突**；**10 项定义缺口（ambiguity）** |

产出文件：

- `products/universe-v14.json` — 结构化规则包（146 条）
- `products/universe-v14-conflicts.json` — 冲突与歧义清单（22 + 10）
- `docs/phase1-open-questions.md` — 需要你人工确认的问题清单

---

## 1. 逐页覆盖情况

| 页 | 标题 | 抽取内容 | 规则数 |
|---|---|---|---|
| 1 | 封面 | 版本 v14 03-02-2026（与文件名 04-05-2026 不一致） | 版本冲突 |
| 2 | Special | 产品总纲：$3M、60% LTV、无收入文件、签证、gift、reserve、6 州 | 12 |
| 3 | Loan amount>$2M exception process | Exception 所需信息与流程 | 3 |
| 4 | Successful Case-$2.9M | 案例（非规则，仅参考） | 0 |
| 5 | Case study-Gift letter & Lock | 案例文件样张 | 0 |
| 6 | Marketing Points | 摘要页（多处与明细页冲突的来源） | 7 |
| 7 | Lending areas | 6 州 37 个 county 完整清单 + TX 限制 | 4 |
| 8 | Items to watch out for (1-5) | 签名、business funds 证明、FICO 680、massage | 6 |
| 9 | Items to watch out for (6-8) | SSN/ITIN、point charge、large deposit pattern | 3 |
| 10 | Items to watch out for (9-11) | occupancy、真实雇佣、POA wet sign | 3 |
| 11 | To Do or NOT To Do (1-8) | 放款区域、massage、Exhibit B/C、gift 国别 | 6 |
| 12 | To Do or NOT To Do (9-16) | LOE、签名、REO、RCE、DTA 取低、W-8、HO6 | 8 |
| 13 | 12 basic factors | 目录页（标题写 12 实际列 13） | 0 |
| 14 | Loan Amount/LTV | **$3M 上限、60% LTV，effective 03-02-2026** | 3 |
| 15 | Qualifying rate | 产品期限、ARM 计算方式、index/margin/cap | 5 |
| 16 | Lock | 30 天、2pm、relock 触发条件 | 2 |
| 17 | EPO/EPD | EPO 12 个月、罚则、20% 限制 | 2 |
| 18 | Credit / Tradelines | FICO、tradeline、迟缴容忍、信用事件 | 8 |
| 19 | DTI/DTA | **DTA 定义版本 A**、60% 上限、境外房产、车贷抵消 | 8 |
| 20 | DTA 示例 | **DTA 计算示例（与定义不一致）** | 1 |
| 21 | DTA 表格 | **DTA 定义版本 B（purchase / refinance 分列）** | 2 |
| 22 | DSCR | DSCR 门槛、租金文件三选一、NY、空置 | 8 |
| 23 | Income | 无收入文件、2 年雇佣信息、Source of Wealth LOE | 4 |
| 24 | Reserve（Primary/2nd） | **FICO 700 分档：12 / 18 个月 PITIA** | 5 |
| 25 | Reserve（Investment） | **投资房 Option A/B 表格 + 文字（同页自相矛盾）** | 6 |
| 26 | Assets | 2 个月对账单、business funds、gift、crypto、retirement | 9 |
| 27 | Gift funds | 3 donors、OFAC、存入时点、donor business | 8 |
| 28 | Gift of Equity | 仅 purchase、不可作 reserve | 2 |
| 29 | Liabilities | 信用报告为准、lease 不计、非 subject REO | 3 |
| 30 | Eligible borrowers | 身份、签证、vesting、co-signer、TX SB17 | 10 |
| 31 | Appraisal | 房产类型、10 acres、CDA、transferred appraisal | 7 |
| 32 | Delayed Financing & Cash Out | 60 天、TX 50a6、**LTV 50% 口径** | 5 |
| 33 | GMCC LO requirements | MLO 资格要求 | 1 |
| 34 | Ineligible borrowers | 三类不合格借款人 | 3 |
| 35 | Exhibit A | **86 国 OFAC/高风险国家清单 + 适用范围** | 3 |
| 36 | Exhibit B | **Prohibited Businesses（业主+员工均不合格）** | 2 |
| 37 | Exhibit C | **Higher-Risk（业主不合格、员工可以）** | 2 |
| 38 | Contact | 联系方式、无 investor AE | 1 |
| 39 | Example for eligibility | 国别 × 行业 × 身份 的判定示例 | 2 |
| 40 | Example for large deposit sourcing | 需/不需 sourcing 的具体示例 | 1 |
| 41 | Example for Source of Wealth LOE | 5 类可接受来源 | 并入 UNI-EMP-012 |
| 42 | Assets for DTA and reserve (1-7) | 逐类资产的 DTA/reserve 处理 | 8 |
| 43 | Assets for DTA and reserve (8-13) | business funds、gift、borrowed funds、tangible | 6 |
| 44 | Universe 5 Year ARM rate | 定价样张（index 3.59%，与第 15 页 3.79% 冲突） | 冲突来源 |

---

## 2. 产品核心参数（无冲突部分）

这些是 PDF 内多处一致、可以直接进 rule engine 的硬参数：

| 项目 | 值 | 页码 |
|---|---|---|
| 放款州 | CA / NV / WA / TX / GA / MA（仅指定 county） | 2, 6, 7 |
| County 数量 | CA 11、TX 4、NV 1、GA 15、WA 3、MA 3（合计 37） | 6, 7 |
| 最高贷款额 | $3M（In House），effective 03-02-2026 | 14 |
| DTA 上限 | < 60%（Primary / 2nd home） | 19 |
| Reserve（Primary/2nd） | FICO ≥700 → 12 个月 PITIA（≥6 个月 liquid）<br>FICO <700 或无分 → 18 个月 PITIA（≥12 个月 liquid） | 24 |
| Reserve 基数 | Qualifying Rate 下的 PITIA | 24 |
| FICO | 无最低要求；<680 需管理层批准 + 补偿因素 | 8, 18 |
| Tradeline | 无最低要求 | 18 |
| 房贷迟缴 | 1x30x12 | 18 |
| 其他迟缴 | 3x30x12、2x60x12、1x90x12；>90 天不合格 | 18 |
| 重大信用事件 | 1 年 seasoning | 18 |
| 产品期限 | 30yr fixed / 15yr fixed / 10-1 / 7-1 / 5-1 ARM；无 Interest Only | 15 |
| ARM 计算 | max(locked note rate, index + margin)；margin 3.25%；cap 2/2/6 | 15 |
| Lock | 仅 30 天；2pm 截止；UW approval 后才可 lock | 16 |
| Gift donors | 最多 3 位，NO EXCEPTION | 26, 27 |
| Gift 作 reserve | 一律不可 | 2, 24, 25, 26, 27, 43 |
| Gift of equity | 仅 purchase；可作首付与费用；不可作 reserve | 28 |
| 房产类型 | SFR、2-4 units、PUD、warrantable condo（需 cert）、≤10 acres | 31 |
| Appraisal | 1 份 appraisal（GMCC approved AMC）+ 1 份 CDA（Clear Capital） | 31 |
| 银行对账单 | 2 个月；美国银行不接受 VOD | 26, 42 |
| 收入文件 | 完全不需要；1003 上不写收入；需 2 年雇佣信息 | 2, 23 |
| Exhibit A | 86 国；仅适用于 VISA/EAD holder 与 Foreign National | 35 |
| Exhibit B | 禁止行业：业主与员工均不合格 | 36 |
| Exhibit C | 高风险行业：业主不合格，员工可以 | 37 |
| Massage | Hard stop，无例外（含 Yelp/网站提及） | 8, 11 |
| TX | 无 primary C/O 与 R/T；50a6 与 delayed financing 不可；China 的 FN/NPRA 不可 | 7, 30, 32 |
| EPO | 售出后 12 个月；罚则 = MLO 佣金 + lender credit（最低贷款额 1%） | 17 |

---

## 3. 计算器所需的 PDF 依据（供 Phase 2 实现）

### 3.1 LTV
PDF 未给出 LTV 的算式定义，只给出上限（60% / 50% 两个口径，见 CONF-001）与价值基准（第 12 页：purchase price 与 appraisal 取低，见 CONF-004）。
→ **Phase 2 的 LTV 计算器必须把「使用了哪个 value」显式展示，并在 purchase 案子同时给出两种基准的结果。**

### 3.2 DTA
三个来源版本（第 19 / 20 / 21 页），见 CONF-002、CONF-003、CONF-004。
资产逐类处理规则来自第 26、42、43 页，已完整结构化为 `UNI-ASSET-*` 与 `UNI-RES-009`：

- 个人银行：2 个月，无 VOD，需 source large deposits
- 股票债券：100%，无 haircut
- 境外银行：2 个月，无对账单时需 VOD（开户日、期初/期末/平均余额）
- 退休金：DTA 100% / liquid reserve 70%（与第 26 页年龄分档冲突，见 CONF-010）
- 人寿保险现金价值：2 个月对账单
- Crypto：必须已变现并可追踪
- Trust：revocable 可 / irrevocable 不可
- Business funds：按持股比例，<100% 需全体股东 access letter，K1/税表不作为持股证明
- 出售资产所得：需出售文件 + 入账
- Gift funds：计入 DTA，不可作 reserve
- Borrowed funds（HELOC / 其他 REO cash out）：可入 DTA，不可作 reserve
- Tangible assets（REO）：净值 = FMV − loan，可入 DTA，可作 non-liquid reserve

### 3.3 DSCR
第 22 页与第 25 页两套口径（见 CONF-005）。租金来源必须为第 22 页三选一之一，且「executed rental agreement + reasonability test 取低」是明文规则。
→ **无租金数据时不得估算，必须输出 insufficient_data。**

### 3.4 Reserve
- Primary / 2nd：第 24 页表格（FICO 700 分档）
- Investment：第 25 页 Option A / B 表格 + 同页文字（自相矛盾）
- 不可计入 reserve 的资金：gift funds、gift of equity、borrowed funds、cash-out proceeds（例外见 CONF-006）
- Non-liquid 可计入：REO 净值（美国与境外）、Auto、boats、gold & silver bullion

### 3.5 Large Deposit
阈值 = 6 个月 subject PITIA（第 9、26 页）/ 100% of PITIA（第 42 页）——见 CONF-009。
Pattern 判定规则与正反两组示例见第 40 页，已结构化为 `UNI-LD-003`、`UNI-LD-005`。

### 3.6 Post-closing Assets
PDF 未直接定义 post-closing assets 的算式，但第 19、21 页均以「扣除 cash to close / 用于购买 subject 的资产」后的余额为基础。
→ **Phase 2 按「总可用资产 − down payment − closing costs − 其他必须现金」实现，并在结果中标注 PDF 无明文算式。**

---

## 4. 冲突汇总（详见 conflicts JSON）

| ID | 主题 | 严重度 | 页码 |
|---|---|---|---|
| CONF-001 | 最高 LTV 60% vs 50%（C/O、Investment） | critical | 2, 6, 14, 25, 32 |
| CONF-002 | DTA Total Assets 三个版本 | critical | 19, 20, 21 |
| CONF-003 | 车贷在 DTA 中抵消 vs 双边计入 | high | 19, 20 |
| CONF-004 | 价值基准：appraisal vs 取低 | high | 12, 20, 21 |
| CONF-005 | 投资房 DSCR/reserve 门槛（含「DSCR>=1%」疑似笔误） | critical | 22, 25 |
| CONF-006 | Cash-out proceeds 作 reserve：<45% vs <=45% vs 禁止 | high | 2, 6, 22, 25 |
| CONF-007 | Gift 存入时点与 1 vs 2 个月对账单 | high | 27, 43 |
| CONF-008 | 赠与人是否必须为亲属 | high | 27, 43 |
| CONF-009 | Large deposit 阈值 6 个月 vs 1 个月 PITIA | high | 9, 26, 42 |
| CONF-010 | 退休金 100% vs 70% 的适用场景 | high | 26, 42 |
| CONF-011 | $3M in-house 与 >$2M exception 并存 | high | 2, 3, 14 |
| CONF-012 | ARM index 3.79% vs 3.59% | high | 15, 44 |
| CONF-013 | NY DSCR 条款但 NY 不在放款区域 | high | 7, 22 |
| CONF-014 | 墨西哥借款人：不合格 vs 可例外 | high | 2, 35 |
| CONF-015 | FICO 680 与 700 两个门槛易混淆 | warning | 8, 18, 24 |
| CONF-016 | Business funds 持股证明是否排除 K1 | warning | 8, 43 |
| CONF-017 | Offshore business 排除国清单读法 | high | 37, 39 |
| CONF-018 | 境外房产在 DTA / reserve 的处理 | warning | 19, 25 |
| CONF-019 | 版本日期不一致（封面/文件名/生效日/index 日） | high | 1, 14, 15 |
| CONF-020 | 「12 basic factors」实为 13 项 | info | 13 |
| CONF-021 | Gift funds 用于投资房是否限 purchase | warning | 2, 6, 27 |
| CONF-022 | Cash out 禁用 POA 与 POA 操作要求交叉 | info | 10, 30 |

另有 10 项 **定义缺口**（`unresolvedAmbiguities`），其中最影响计算的是：

- **AMB-001 PITIA 的构成未定义** —— 而 reserve 与 large deposit 都以它为基数
- **AMB-004 CLTV/HLTV 中次级留置权按余额还是额度**
- **AMB-008 多借款人时 FICO 取值规则**

---

## 5. 本阶段的判断边界

以下内容 **没有** 写进 rule engine，因为 PDF 未明文规定：

1. PITIA 的具体构成与地税/保险取值方式
2. LTV 的算式（PDF 只给上限，未给分母定义）
3. Post-closing assets 的官方算式
4. 多借款人时 FICO / 资产的合并口径
5. 2-4 units 自住时其他单元租金的处理
6. Departing residence 已挂牌 / 已签约时的处理
7. 任何「行业惯例」性质的补充（例如 Fannie/Freddie 的常规做法）

以上均已列入 `docs/phase1-open-questions.md`，等待你确认后再实现。
