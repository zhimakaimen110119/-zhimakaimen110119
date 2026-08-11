# Loan Intake Copilot

给 Mortgage Loan Officer 使用的本地优先 Web App：读取 LO 手上已有的客户情况，结合产品 guideline，一次性生成可以直接发给客户的问题清单、冲突提示与资格风险提示。

> **V1 范围**：不连接 Encompass、不修改 Encompass、不保存真实客户数据、仅接受 synthetic 或 de-identified case。

---

## 当前进度：Phase 2 设计已提交，等待确认后进入 Phase 3

| 阶段 | 内容 | 状态 |
|---|---|---|
| Phase 1 | 阅读 PDF → guideline extraction report → 规则包草稿 → 冲突清单 → 待确认问题 | ✅ 完成（含 2026-08-11 修订：三层架构 + 重分类） |
| Phase 2 | 项目架构、数据 schema、rule engine 设计、计算器设计、UI wireframe | ✅ 提交，见 [`docs/phase2-design.md`](docs/phase2-design.md)，等待确认 |
| Phase 3 | 可运行 MVP + 测试 + synthetic sample case + 本地运行说明 | ⏸ 等待 Phase 2 确认 |

### 规则库（三层架构）

| 文件 | 内容 |
|---|---|
| [`products/universe-v14/source-rules.json`](products/universe-v14/source-rules.json) | PDF 原文抽取的 **146 条不可变规则**，不修改、不合并 |
| [`products/universe-v14/conflicts.json`](products/universe-v14/conflicts.json) | **6 项核心未决冲突**（需公司确认）+ 3 项次要待定 + 14 项已关闭/重分类记录 + 9 项定义缺口 |
| [`products/universe-v14/policy-overrides.json`](products/universe-v14/policy-overrides.json) | 人工书面确认的运营口径（9 confirmed + 2 operational default + 6 pending 占位）。**rule engine 只把 confirmed / operational_default 当最终口径** |

未确认的规则不阻塞开发：能双口径计算的展示两个结果；需要数值的要求 LO 手动输入；影响资格的显示 `Manual Confirmation Required`；guideline 内部冲突绝不出现在发给 borrower 的问题里。

### 文档

| 文件 | 内容 |
|---|---|
| [`docs/phase1-guideline-extraction-report.md`](docs/phase1-guideline-extraction-report.md) | 抽取报告：逐页覆盖表、核心参数、计算器依据 |
| [`docs/phase1-open-questions.md`](docs/phase1-open-questions.md) | 初版问题清单（历史存档，最新口径以 conflicts.json 为准） |
| [`docs/company-questions-email.md`](docs/company-questions-email.md) | 发给 Production 的 **6 个核心问题**邮件草稿 |
| [`docs/phase2-design.md`](docs/phase2-design.md) | Phase 2：架构、Zod schema、rule engine、6 个计算器、PII Guard、问题生成、UI wireframe、15 项测试计划 |

### 数据来源

唯一依据：`GMCC Universe V14 04-05-2026.pdf`（44 页）。

抽取原则：

1. 只结构化 PDF 原文，**不引入 PDF 之外的常识或行业惯例**
2. PDF 内部冲突 **不静默解决**，标记 `Manual Confirmation Required` 并展示冲突页码与原始规则
3. 每条规则保留 `sourcePage` 与 `sourceText`，结果页可回溯到 PDF 原文

---

## 数据安全

- 页面固定提示：**Do not enter real borrower PII. Use synthetic or de-identified information only.**
- 分析前运行 PII Guard，识别并阻止/警告：完整 SSN、完整 DOB、银行账号、Encompass loan number、routing number、未打码信用报告信息、真实姓名 + 敏感财务信息、完整住宅地址
- 不记录输入内容、不写日志、不接 analytics、不把客户内容写入 localStorage

---

## 技术栈（Phase 2/3）

Next.js（App Router）+ TypeScript + Zod + 本地 JSON 规则包。无数据库、无登录、无 Encompass API、无浏览器自动化、无客户文件上传。

AI 仅用于：自然语言 → 结构化字段、缺失字段合并成人话问题、问题措辞优化。
产品规则与全部金额计算由 TypeScript rule engine 与 deterministic calculators 完成。
