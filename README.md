# Loan Intake Copilot

给 Mortgage Loan Officer 使用的本地优先 Web App：读取 LO 手上已有的客户情况，结合产品 guideline，一次性生成可以直接发给客户的问题清单、冲突提示与资格风险提示。

> **V1 范围**：不连接 Encompass、不修改 Encompass、不保存真实客户数据、仅接受 synthetic 或 de-identified case。

---

## 当前进度：Phase 1 已完成，等待人工确认

| 阶段 | 内容 | 状态 |
|---|---|---|
| Phase 1 | 阅读 PDF → guideline extraction report → 规则包草稿 → 冲突清单 → 待确认问题 | ✅ 完成 |
| Phase 2 | 项目架构、数据 schema、rule engine 设计、计算器设计、UI wireframe | ⏸ 等待 Phase 1 确认 |
| Phase 3 | 可运行 MVP + 测试 + synthetic sample case + 本地运行说明 | ⏸ |

### Phase 1 交付物

| 文件 | 内容 |
|---|---|
| [`docs/phase1-guideline-extraction-report.md`](docs/phase1-guideline-extraction-report.md) | 抽取报告：逐页覆盖表、核心参数、计算器依据、冲突汇总 |
| [`products/universe-v14.json`](products/universe-v14.json) | 结构化规则包，**146 条规则**，21 个分类 |
| [`products/universe-v14-conflicts.json`](products/universe-v14-conflicts.json) | **22 项规则冲突 + 10 项定义缺口**，每项含双方原文、页码、冲突原因、需 LO 确认的问题、系统应有行为 |
| [`docs/phase1-open-questions.md`](docs/phase1-open-questions.md) | 需要人工确认的问题清单（A/B/C 三级优先级） |

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
