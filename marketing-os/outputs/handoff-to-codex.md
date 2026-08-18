# 交给 Codex 的任务书（时令食谱 · 美国市场首笔收入）

你在本机上有 shilingshipu.com 的代码库。我没有 —— 我这边的沙箱代理封了 `www.shilingshipu.com`（403 CONNECT），这个 GitHub 账号下也没有该产品的 repo。所以下面每一条"未知"都是真的未知，不是我懒得查。

**我的产出在这里，先拉下来读：**
```
git clone https://github.com/zhimakaimen110119/-zhimakaimen110119
cd -zhimakaimen110119 && git checkout claude/shilingshipu-marketing-os-v1-pd4d6i
ls marketing-os/
```
先读这三个：`rules/constitution.md`、`campaigns/campaign-002/campaign.yaml`、`outputs/human-actions.md`。

---

## 已经定下来的（不要重新论证，直接用）

| 项 | 结论 |
|---|---|
| 市场 | 美国，华盛顿州。中国市场降为并行实验，不得阻塞美国首笔收入。 |
| 买家 | **不是家庭做饭的人。** 是西雅图都会区的小型中餐商户 —— 时令信息猜错了会亏钱的人。 |
| 产品 | 每个节气一份「运营包」：当地当造食材 + 菜单行 + 可直接发的文案。 |
| 定价 | **$49 一次性**，按对方实际菜单定制，48 小时 PDF 交付，可退。不是订阅。 |
| 收款 | Stripe Payment Link，华州个体户，不需要注册公司，无 EIN 时填 SSN。 |
| 当前活动 | campaign-002，20 家已打分的目标商户，20 条已写好的个性化外联，处暑免费包已写完。 |

理由和证据链在 `campaigns/campaign-001/`（council 三个独立 Agent + Red Team + Judge 评分）和 `campaigns/campaign-002/pricing-us.md`。有异议先读那两处再说。

---

## 你要做的四件事，按优先级

### 1. 产品审计 —— 我做不了，只有你能做

输出到 `marketing-os/products/shilingshipu/audit.md`。回答：

- 网站今天到底做什么？浏览 / 搜索 / 按季筛选 / 生成菜单？
- 有没有注册、账号、邮箱采集？装了什么 analytics（GA4 / Plausible / Umami / Vercel / 无）？
- 有没有接支付？哪家？
- **季节数据是哪个地区的？** 只有中国大陆，还是能处理其他地区？这条直接决定产品能不能服务美国用户。
- 技术栈、部署在哪、改一个页面要多久。

改完把 `products/shilingshipu/product.yaml` 里 `status: assumed` 的字段改成 `confirmed` 并填真值。那个文件现在有 15 个未确认字段，全是我的推断。

### 2. 装 analytics —— 现在完全是瞎的

Plausible 或 Umami，随便哪个，装上就行。必须能收 UTM 五参数（source / medium / campaign / content / term）。

队列里 20 条链接的 UTM 已经生成好了，格式见 `outputs/queue/campaign-002/queue.md`。现在它们指向一个测不到任何东西的站。

### 3. 一个极简落地页 + Stripe Payment Link

路径 `/jieqi` 或类似。内容：

- 处暑包的完整内容直接展示（不设门槛，不要邮箱，不要注册）—— 内容在 `campaigns/campaign-002/content/chushu-pack-pnw-v1.md`
- 底部一个 Stripe Payment Link：**「节气 Pack — one pack, $49」**
- 一句话说明：按你的菜单定制，48 小时 PDF，不满意全额退

**不要做**：注册流、订阅、用户系统、后台。第一笔钱不需要任何这些。

### 4. 交付工时是真正的瓶颈，请从工程上解决

每份定制 90 分钟 × 25 客户 × 每月 2 份 = 每月 75 小时换约 $2,300。**这门生意成不成立，取决于每份包里有多少是所有客户通用的。目标 80% 通用 + 薄定制层。**

能做的：
- 一个节气 → 太平洋西北当造食材的数据表（一次建，24 期复用）
- 从这张表生成基础包的脚本
- 定制层只做"匹配这家菜单上已有的菜"

这件事比落地页重要。落地页两小时，这个决定生意能不能规模化。

---

## 明确不要做的

- 不要重构产品。除非增长实验证明某个改动能提升 activation / conversion / revenue。
- 不要做订阅计费。$49 一次性验证通过之前不碰。
- 不要接社媒 API。20 条外联是人手发的，不需要任何平台账号。
- 不要把 ¥199 换算成美元。那个数字作废了，理由在 `pricing-us.md`。

---

## 两个法律项 —— 不挡首笔 $49，挡规模化

1. **华州 ESSB 5814**（2025-10-01 生效）扩大了数字自动化服务的零售税范围，并删掉了"人工参与"豁免。这个产品算不算在内，没有定论。**需要华州 CPA，不是搜索引擎能答的。** 如果应税，定价要含税，否则报价数字后面会变。
2. **华州 DOR 营业执照门槛**：年营业额 $12,000，以及使用非本人法定姓名经营等其他触发条件。

两条都记在 `campaigns/campaign-002/campaign.yaml` 的 `open_legal_items`。

---

## 三个我验证不了、你要当心的

1. **65 家候选商户，没有一家的官网我打开过。** 沙箱代理挡了所有外部域名，地址电话全部来自搜索结果摘要。两个 Agent 一个下午撞到 **14 家已永久关闭**的中餐商户。发之前必须逐家确认还开着。`U Lin Asian Bistro` 和 `Great China Restaurant` 已标记必须先查。
2. **不要在任何文案里写具体省钱金额。** 找不到"因季节采购判断失误造成的损耗"的专门数据。4–10% 是全行业食材损耗，不是这个产品解决的那部分。方向性论证可以，精确数字是编的。
3. **`pricing-us.md` 里每一个价格都来自搜索结果综合，不是我打开厂商页面读的**（同样被代理挡了）。引用给客户之前逐条打开确认。

---

## 一个 Agent 打不开的口子

私房菜 / 微信团购 / 华人 meal-prep 卖家 —— 两个 Agent 在不同片区独立跑了九个搜索角度，中英文都试了，**一家都没找到**。它们在封闭微信群和小红书里做生意，搜索引擎索引不到。

两个独立 Agent 收敛到同一结论，这是发现不是失败。而这一段很可能是匹配度最高的买家：最小、对食材成本最敏感、最缺文案。**这个渠道需要一个有微信的人，Agent 打不开。**

---

## 怎么验证你做完了

```bash
cd marketing-os
node lib/mos.mjs validate shilingshipu campaign-002    # 应当 0 FAIL
node lib/mos.mjs dryrun   shilingshipu campaign-002    # 应当 LAUNCH-READY
```

产品审计做完后，`EVI-01` 那条 warning 里的未确认字段数应该从 15 降到接近 0。那个数字就是进度条。
