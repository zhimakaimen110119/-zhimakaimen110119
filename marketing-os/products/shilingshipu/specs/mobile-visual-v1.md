# 实现规格 · 移动端适配 + 界面与文案升级 · v1

写给：创始人 + Mac 上的 Claude Code / Codex
日期：2026-09-22（秋分）

**前提**：作者没读过代码、打不开线上站（沙箱代理封锁 www.shilingshipu.com）、读不到本机的 `PROJECT_STATE.md`。所以这份规格由五样可独立使用的东西组成：

| 文件 | 是什么 | 怎么用 |
|---|---|---|
| 本文件 | 裁定、规则、审计清单、实施顺序 | 读 |
| `mobile-visual-v1/base.css` | 基础样式 + 设计 token，框架无关 | 整文件放进项目，Tailwind 映射见 §2.7 |
| `mobile-visual-v1/home.html` | 秋分首屏样张 | 对照改样式，不是照抄结构 |
| `mobile-visual-v1/list.html` | 买菜清单样张 | 同上 |
| `mobile-visual-v1/copy.md` | 文案声音规则 + 全部界面字符串重写表 | 逐条替换 |

起因：创始人 9/22 的判断——"界面和语言太 low"——加上一份 Gemini 给出的改造建议。Gemini 那份只做参考：工程部分大体对但有三处会引入新 bug，视觉方向对但两个颜色不达标，文案部分与本项目已定规则冲突。逐条裁定在 §1。

---

## 0. 先说结论

**"low" 不是一层，是四层。Gemini 只看到了第一层。**

三个独立方向（刊物物候 / 静默工具 / 菜市场的笃定）各自出了首页和买菜清单的样张，三位评审（刊物编辑、合规与工程、周三晚七点的用户）背对背打分。三人排序一致：静默工具最高（24.3），菜市场其次（20.5），刊物物候最低（19.5）——**最像"东方生活美学杂志"的那个方向得分最低**，因为它把空框、七十二候、印章、竖排小标一层层叠上去，评审的原话是"对'没有照片'的代偿"。

三位评审在"三个方向都还没解决什么"上给出了几乎相同的答案。这就是 low 的真正来源：

| 层 | 症状 | 谁能治 | 怎么治 |
|---|---|---|---|
| **1. 讨好** | 语气词、药丸标签、圆角卡片、荧光绿、四字空话、"为您精心" | 代码 + 字符串 | Gemini 看到的这层。base.css + copy.md 已治 |
| **2. 页面在向评审说话** | "拿齐了这里会换成盘一盘""整行可点""实拍图位 · 灶台随手拍"——产品在向用户描述自己的界面逻辑。**这是课设答辩的口吻，比"亲～今日份美味"更根本的廉价** | 代码 + 字符串 | 版面里不允许任何一句解释界面将来会怎样的话；"起草 / 待核实"全站只在顶部开发者提示里出现一次，上线时整行撤掉 |
| **3. 一种颜色干五份工** | 赭石同时是节气名、标签、链接、按钮底、勾选框、印章、进度条。一个色值承担所有"重点"= 模板的"主题色"。**这是 AI 界面最隐蔽的指纹，纸底和宋体盖不住** | CSS | `--accent` 全站只出现在三处：节气名、主按钮、勾选框。标签退成 `--ink-2`，链接 `--ink` 加下划线，进度线 `--ink` |
| **4. 页面上没有人、没有食物** | 首屏是一块空色块；作者只在页脚出现一句。高级感的来源不是克制的版式，是"有一个具体的人替我看过了"在页面中段就能被感到，以及一件"这个人真的去过"的证据 | **只有创始人能治** | ① 今晚在灶台上用手机拍一张番茄炒蛋，顶灯，45 度，酱油瓶不用挪；② 去一趟 H Mart 把"待核实"划掉；③ 作者在正文里出现两次（"这道菜不用我教""我再给你挑一样"），不只在页脚 |

第三位评审还补了一条：**三版首页都是"一篇文章"，不是"一个决定"**——六七个等重的段落从上到下堆。合成版首屏只允许一个大元素（食材名两个字）和一个填色按钮，其余全部 1rem 及以下。

所以这份规格的排序是：**先做第 2、3 层（纯代码，今天能上），第 1 层顺手做（Gemini 的建议大多在这里），第 4 层是创始人的一个晚上 + 一趟超市，不是工程。** 排版和文案能做的到此为止，剩下的 low 不在字里，在数据里。

合成版样张：`mobile-visual-v1/home.html`、`list.html`（含空 / 0% / 100% / 全勾复制 / 剪贴板失败五个状态，都是操作出来的，不是画出来的）。截图见同目录 `*.png`。

---

## 1. 对 Gemini 建议的逐条裁定

| # | Gemini 建议 | 裁定 | 理由 / 改法 |
|---|---|---|---|
| 1 | `viewport-fit=cover` + `env(safe-area-inset-*)` | **采纳，改写法** | 安全区只加在贴边元素（sticky 头、fixed 底栏、页面左右 gutter），不加在 `html`/`body` 上。见 base.css §2 |
| 2 | `maximum-scale=1.0, user-scalable=no` | **不采纳** | iOS 10 起 Safari 直接无视这两个值；安卓 Chrome 会真的禁掉双指放大——用户里有父母辈。WCAG 1.4.4。它想解决的其实是 iOS 输入框聚焦自动放大，正解是 `input { font-size: ≥16px }` |
| 3 | 废 `100vh` 改 `100dvh` | **采纳，加兜底** | 写成 `min-height: 100vh; min-height: 100dvh;`（iOS < 15.4、旧安卓 WebView 不认 dvh）。首屏高度用 `svh`（稳定），`dvh` 只给全屏弹层：dvh 在地址栏收缩时会变，按它定高的元素会在滚动时跳 |
| 4 | `html, body { padding-top/bottom: env(...) }` | **不采纳** | html 和 body 都加就是双倍留白；再叠 `min-height: 100dvh` 会让短页面多出一截滚动 |
| 5 | `-webkit-tap-highlight-color: transparent` | **采纳，必须配 `:active`** | 去掉高亮之后不补按下反馈，按钮点了像死的 |
| 6 | `-webkit-font-smoothing: antialiased` | 无害，也无用 | 只影响 macOS，跟手机差异无关 |
| 7 | 不写死 `height = line-height`；flex 居中；显式中文字体栈 | **采纳** | base.css §3–4。补一条：`-webkit-text-size-adjust: 100%`，iOS 横屏不自动放大字 |
| 8 | `@media (hover: hover)` 隔离悬停 | **采纳，加 `pointer: fine`** | Tailwind v4 的 `hover:` 已默认这样做；v3 在 config 开 `future.hoverOnlyWhenSupported: true`，一行解决，不用手写媒体查询 |
| 9 | `clamp(1.25rem, 5vw, 2rem)` | **修正** | 中间项纯 vw 不跟随用户放大字号；而且 320–430px 宽全部落在 20px，等于没缩放。改 `clamp(1.75rem, 1.2rem + 3vw, 2.5rem)` |
| 10 | 纸底 `#F8F6F0`，浅墨 `#33312E`，弃 slate / emerald | **采纳** | 实测对比 12.0:1 |
| 11 | 四季主轴色 | **采纳，两个色不能做小字** | 春·天青 `#5D7A88` 4.2:1、秋·金粟 `#9E7E38` 3.5:1 在纸底上不够正文对比；只做装饰或 ≥24px 大字。夏·朱砂 4.5 临界。**今天就是秋季，金粟这一条是当下生效的** |
| 12 | 宋体标题、行距 1.75 | **采纳，行距改** | 标题 1.35，正文 1.75；多行标题用 1.75 会散。只加载一个字重（600） |
| 13 | 破除卡片套娃：细线 + 留白 | **采纳** | 细线 `#E5E0D8` 对比 1.2:1，只能做分隔；复选框、输入框边框要 ≥3:1，用 `#8F877B` |
| 14 | 去 `hover:scale-105`；`cubic-bezier(0.16, 1, 0.3, 1)` | **采纳** | 补 `prefers-reduced-motion`；不动画 `height`（低端安卓逐帧重排），用 grid `0fr → 1fr` |
| 15 | 节气印章、细线标尺 | **采纳，限量** | 一屏一枚。每个标签都做成印章就成了另一种药丸 |
| 16 | 24 节气横向吸附滚动 + 背景渐变 | **不采纳** | gap-closing-spec 明确不做节气总览："它在展示你没完成的另外 23 个"。允许的只有一行字：「下一个 · 寒露 10/8」 |
| 17 | Slogan「顺时而食，寻味人间。春生夏长，秋收冬藏，不负四时风物。」 | **不采纳** | 一年到头都成立，正是 gap-spec 1.1 禁止的"加宽落差"写法（它把"不时不食，遵循古人智慧"列为反例） |
| 18 | 节气提示「禾乃登，秋风肃。暑气渐敛，宜食秋梨白鸭，以润金秋之气。」 | **部分** | 七十二候作为日历事实的小字可以（brand.yaml 允许"节气作为日历事实"）；"以润金秋之气"是食疗功效，禁（brand.yaml do_not、gap-spec 1.5、approval-policy H5）；秋梨换成本地梨的事实 |
| 19 | 标签「当季风物 · 霜前头采 · 柴火温煨」 | **不采纳** | 不是事实就是编造（宪法第 8 条）。标签必须有成立条件，见 copy.md 标签词汇表 |
| 20 | 用量表头「物料考究 · 适量取用」 | **不采纳** | "适量"把累坏的人需要的数字拿掉了。gap-spec 2.3：玉米 2 根 · 鸡蛋 3 个 |
| 21 | 去卡路里表格，改"物候引导与食材性味" | **半采纳** | 去卡路里对；"性味"（寒热温凉）是食疗框架，禁 |
| 22 | 摄影走"东方生活美学杂志" | **不采纳** | gap-spec 3.1：照片要"够得着"。界面外壳可以有刊物感，照片必须是家里的样子——这条分界线是本规格的核心 |
| 23 | 排期：视口 → 调色字体 → 剥离标签阴影 | **采纳，加一步** | 文案必须同批做。高级的壳配 low 的话，割裂感比现在更明显 |

---

## 2. 移动端：修正后的底层配置

全部已写进 `mobile-visual-v1/base.css`，这里只说为什么。

### 2.1 viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F8F6F0">
<meta name="color-scheme" content="only light">
```

- `theme-color`：Safari / Chrome 的地址栏跟纸底同色，否则顶部一条白。
- `color-scheme: only light`：三星浏览器"夜间模式"和 Chrome 安卓的"自动深色"会把纸色强制反成灰黑——这是真实的"不同手机显示差异"，Gemini 那份没提。`only` 是规范里阻止强制反色的写法；三星需真机验证。以后做真正的暗色主题再改。

### 2.2 安全区：只给贴边元素

```
sticky 头        padding-top: env(safe-area-inset-top)
fixed 底栏       padding-bottom: max(8px, env(safe-area-inset-bottom))
页面左右 gutter  padding-left/right: max(16px, env(safe-area-inset-left/right))   ← 横屏时刘海在侧面
主体             padding-bottom: calc(底栏高 + max(8px, env(safe-area-inset-bottom)))
```

iPhone SE 这类无横条机型 inset 为 0，`max(8px, …)` 保证还有一点呼吸。

底栏默认 `position: sticky; bottom: 0`，放在滚动容器末尾：贴视口底，页面比视口短时跟在内容后面，不盖内容，主体不用补 padding，整页截图和打印也不会盖住末尾。只有底栏不在滚动容器末尾时才用 `.bottom-bar--fixed` + `.has-bottom-bar`。

### 2.3 视口高度

| 用途 | 写法 |
|---|---|
| App 壳 / body | `min-height: 100vh; min-height: 100dvh;` |
| 首屏（要"一屏放下"的） | `min-height: 100svh`，不随地址栏跳 |
| 全屏弹层、底部抽屉 | `max-height: 85dvh`，兜底 `85vh` |
| 滚动容器 | 永远不要 `height: 100vh` |

Tailwind ≥ 3.4 直接有 `min-h-dvh` / `h-svh`。

### 2.4 触摸

- 去 tap highlight → 必须补 `.btn:active { opacity: .78 }`。
- 悬停只给 `(hover: hover) and (pointer: fine)`。
- `:focus-visible` 保留，键盘和读屏要用。
- 可点行 `min-height: 44px`，整行是点击区（`label` 包住 checkbox）。
- 底部抽屉 `overscroll-behavior: contain`，不带动背后页面。
- 键盘弹起时（盘一盘的「还买了别的」输入框）fixed 底栏会浮到键盘上方盖住输入：输入框聚焦期间给 body 加 `.is-typing` 把底栏收起。

### 2.5 字体

```
宋体（只给节气名、菜名/食材名）  "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif
黑体（其余全部）                 -apple-system, "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif
```

- 宋体只加载一个字重（600）。Google Fonts 会把中文字体按 unicode-range 自动切成一百多片，浏览器只下用到的片；或者用 `pyftsubset` 把节气名 + 菜名这个封闭字符集切成 < 100KB 自托管。别把整个 Noto Serif SC 四个字重塞进去（每个几 MB）。
- `-apple-system` 排第一：英文走 SF，中文自动落到 PingFang。
- 不写死文字容器的 `height`。**安卓微信会按用户在微信里设的"字体大小"放大网页文字**，写死高度的地方文字会被截断。只用 `min-height`。

### 2.6 Gemini 没提、但对这个用户群更要命的几条

| 现象 | 根源 | 修法 |
|---|---|---|
| 微信里打开字被截断、按钮挤成两行 | 安卓微信按用户字体设置缩放网页；分发渠道就是微信群 | 不写死高度；真机把微信字体调到最大测一遍 |
| 三星手机上整个页面灰黑、纸色消失 | Samsung Internet 夜间模式强制反色 | `color-scheme: only light` + 真机验证 |
| 老人手机上字巨大、布局散架 | 系统字体放大 200% | 用 rem 不用 px 定字号；标题 `clamp` 里带 rem 项 |
| 点输入框整个页面放大 | iOS 对 < 16px 的输入框自动缩放 | `input { font-size: max(16px, 1rem) }` |
| 底部按钮被键盘顶上来盖住输入框 | fixed 元素相对可视视口 | 聚焦时收起底栏 |
| 复制清单在微信里没反应 | 微信 WebView 剪贴板 API 受限 | grocery-list 规格 R4 的降级已覆盖 |

### 2.7 接进项目

**纯 CSS / CSS Modules**：`base.css` 整文件引入，放在全局样式最前面。

**Tailwind v3**：
```js
// tailwind.config.js
module.exports = {
  future: { hoverOnlyWhenSupported: true },   // 一行解决 hover 卡住
  theme: { extend: {
    colors: {
      paper: 'var(--paper)', 'paper-deep': 'var(--paper-deep)',
      ink: 'var(--ink)', 'ink-2': 'var(--ink-2)',
      rule: 'var(--rule)', control: 'var(--control)',
      accent: 'var(--accent)', 'accent-deco': 'var(--accent-deco)',
    },
    fontFamily: {
      serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'serif'],
      sans: ['-apple-system', '"PingFang SC"', '"Hiragino Sans GB"', '"Noto Sans SC"', 'sans-serif'],
    },
    transitionTimingFunction: { unfold: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  } },
}
```
然后 `bg-paper text-ink border-rule text-accent font-serif ease-unfold` 就能用。

**Tailwind v4**：在全局 CSS 里
```css
@import "tailwindcss";
@import "./base.css";
@theme inline {
  --color-paper: var(--paper); --color-paper-deep: var(--paper-deep);
  --color-ink: var(--ink); --color-ink-2: var(--ink-2);
  --color-rule: var(--rule); --color-control: var(--control);
  --color-accent: var(--accent); --color-accent-deco: var(--accent-deco);
  --font-serif: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  --ease-unfold: cubic-bezier(0.16, 1, 0.3, 1);
}
```
v4 的 `hover:` 变体默认只在支持悬停的设备生效，不用额外配。

**季节色**：`<html data-season="autumn">` 必须在首帧前写好——服务端渲染、构建时写死、或 `<head>` 里的同步内联脚本。页面加载完再用 JS 改会先闪一下默认色。季节按节气切（立春 / 立夏 / 立秋 / 立冬），按 `America/Los_Angeles` 算日期，不按月份。

### 2.8 真机测试矩阵

| 设备 | 看什么 |
|---|---|
| iPhone 有刘海 / 灵动岛，Safari | 底栏不被横条遮、不双倍留白；地址栏收缩时首屏不跳 |
| iPhone SE（375×667，无横条） | 底部没有多余空白（inset = 0 路径） |
| 中端安卓，Chrome，手势导航 | 同上 + 系统字体放大 200% |
| 三星 + Samsung Internet，开夜间模式 | 纸色是否被反成灰黑 |
| **微信内置浏览器，iOS 与安卓各一台，微信字体调到最大** | 截断、换行、复制清单 |
| 任意一台，宽 320 | 无横向滚动（DevTools 也能测这一条） |

DevTools 模拟不了安全区、微信缩放和三星反色。**这三条必须真机。**

---

## 3. 视觉 token（对比度为纸底 `#F8F6F0` 上实测）

| token | 值 | 对比 | 用途 |
|---|---|---|---|
| `--paper` | `#F8F6F0` | — | 页面底 |
| `--paper-deep` | `#F1EDE4` | — | 分区底，替代白卡片。不加阴影 |
| `--ink` | `#33312E` | 12.0 | 正文。不用 `#000` |
| `--ink-2` | `#6B655C` | 5.3 | 次要文字。**不用 gray-400 一类，小字不达标** |
| `--rule` | `#E5E0D8` | 1.2 | 装饰细线，只做分隔 |
| `--control` | `#8F877B` | 3.3 | 复选框 / 输入框边框（WCAG 1.4.11 要求 ≥3） |
| `--accent` 春 | `#4A6B53` | 5.5 | 小字、链接、按钮底 |
| `--accent-deco` 春 | `#5D7A88` | 4.2 | 只做装饰 / ≥24px |
| `--accent` 夏 | `#2D4B3E` | 8.9 | |
| `--accent-deco` 夏 | `#B8513F` | 4.5 | 临界，只做装饰 |
| `--accent` 秋 | `#8C5039` | 5.9 | |
| `--accent-deco` 秋 | `#9E7E38` | 3.5 | **不能做小字、不能做按钮底** |
| `--accent` 冬 | `#2F3640` | 11.3 | |
| `--accent-deco` 冬 | `#6E4A35` | 7.2 | |

规则：`--accent-deco` 只出现在印章边框、大字、装饰线上。凡是 < 24px 的字，只用 `--ink` / `--ink-2` / `--accent`。

**更重要的一条：`--accent` 全站只出现在三处——节气名、主按钮、勾选框。** 标签用 `--ink-2`，链接用 `--ink` 加下划线，进度线用 `--ink`。一个颜色干五份工是模板"主题色"的指纹（§0 第 3 层）。base.css 的 `.tag` 默认已经是 `--ink-2`。

宋体也只给两处：节气名、菜名 / 食材名（`.t-serif`）。清单标题、分区名、弹层标题都是黑体。首屏那一个食材名用 `.h-display`，是整页唯一允许那么大的东西。

---

## 4. 文案

完整内容在 `mobile-visual-v1/copy.md`：① 声音规则（已写进 brand.yaml 的 `localization.zh`）、② 21 组界面字符串的重写表（原文 / 改为 / 为什么）、③ 标签词汇表（每个标签的成立条件）、④ 写给创始人的"什么让它 low"。这里只放结论。

### 4.1 声音：一个真在 H Mart 排队的人，替累坏的读者看过了货架，说话只说他能核对的东西

| 规则 | 写 | 不写 |
|---|---|---|
| 每句话落在一个两周后会变的事实上；一年到头都成立的话不写 | 本地露地番茄就剩这两周，秋雨一下透就收摊。 | 顺时而食，不负四时风物。 |
| 判断要给，理由用能上手核对的物给，不用形容词给 | 捏着要硬，蒂还是绿的。掂一掂，上手比看着沉的才好。 | 精选优质番茄，新鲜香甜。 |
| 买不到就说买不到，没有替代就说不换，不打圆场 | 活大闸蟹买不到。大闸蟹不换。 | 用本地蟹也能做出家乡的味道。 |
| 数字只用能数出来的：几样、几分钟、几号；程度词不许顶替数字 | 番茄 2 个 · 鸡蛋 3 个 ／ 6 分钟，切番茄算在内。 | 番茄适量，鸡蛋若干，几分钟搞定。 |
| 按钮和计数连在一起，按之前就知道会发生什么；一个按钮一个动词 | 复制还差的 4 样 | 一键复制清单 |
| 不哄、不叹、不喊。句尾用句号 | 都拿齐了，回家做饭 → | 太棒啦，全部买齐咯！ |
| 节气只当日历用：名字、日期可以；意义、养生、古人智慧、七十二候文言不可以 | 秋分 · 9月22日 — 10月7日 | 秋分时节，雷始收声，宜食秋梨养阴。 |
| 第一人称只在替读者做过事时出现，页脚之外也可以 | 没赶上也不用追。节气两周一换，10 月 8 日寒露，我再给你挑一样。 | 我们精心为您准备了本期时令食材。 |
| 承认边界比包装强；未核实的东西全站只标一处 | 哪家店有什么，去之前当参考，别当保证。 | 全城超市货架实时同步。 |
| 页面不解释自己：描述界面将来会怎样的话、给评审看的注释，不进版面 | （100% 时进度句直接变成可点的「都拿齐了，回家做饭 →」） | 拿齐了这里会换成「盘一盘」 |

这一段和 brand.yaml 原来的「口语化，不要书面报告体」不矛盾，但更准：**"口语"不是"随便"，是"能拿去超市核对的话"。** 之前的样例（「华盛顿州现在最便宜、最好的一样」「扒开顶端看，粒要满到尖」）low 在评价词（最便宜、最好）和说明书腔，不在口语本身。

### 4.2 重写表的几个关键替换（全表 21 组见 copy.md ②）

| 界面 | 现在 | 改为 |
|---|---|---|
| 首屏主标题 | 这两周，买玉米 | 「这两周，买」小字 + **番茄** 一个宋体大字。整页只有一个大字 |
| 首屏三行 | 为什么现在 / 怎么挑 / 今晚做 | 时机 / 挑法 / 做法。两字标签对齐成表 |
| 主 CTA | 今晚就做这个 | 今晚就做番茄炒蛋。全页唯一填色的东西 |
| 宽容声明 | 错过了没关系。一年有 24 个节气… | 没赶上也不用追。节气两周一换，10 月 8 日寒露，我再给你挑一样。 |
| 落差区块 | 老家这周吃的是 / 你这边 / 别找了，换这个 | 江浙这周 / 这边 / 换成（「江浙」说出老家的范围） |
| 清单分区 | 蔬菜区 (0/4) | 蔬菜 · 还差 2 样；齐了写「齐了」 |
| 清单进度 | 进度条 + 百分比 | 一句话 + 一根线：「拿了 5 样，还差 4 样。」不再加「5 / 9」 |
| 清单主按钮 | 复制清单 | 复制还差的 4 样（按下即复制）；换范围走文字链「复制别的」→ 还差的 / 整张单 / 拿了的 |
| 清单次级 | 从餐桌导入 / 快速添加 / 清空 | 从餐桌带入 / 随手加一样 / 清掉整张单（退到分组开关那一行，不贴主按钮） |
| 盘一盘三段 | 这次买的 / 家里还有的 / 还买了别的 | 今天拿回来的 / 冰箱里本来就有的 / 单子外多买的 |
| 标签 | 亚超 / 最后两周 / 这两周最便宜 | 亚超才有 / 只剩两周 / 刚下来 / 普通超市就有；**价格标签删除**（没有价签数据就不能说最便宜） |

### 4.3 标签的成立条件

标签是一个判断，每个判断都有数据条件；条件不满足就不显示，不用「暂无」顶替。「只剩两周」必须挂在 `season_end` 上，没有下市日期不许猜。厨房常备品（鸡蛋、葱姜蒜）不挂店铺标签——标签只给会让人跑错店的东西。行内小字写菜名（「蒸排骨」），只标主料。

### 4.4 只有创始人能做的两件事

- **今晚拍一张番茄炒蛋**：灶台，厨房顶灯，45 度，手机随手拍，酱油瓶不用挪。存成 `photo/qiufen-fanqie.jpg`。样张里 `<figure hidden>` 已经在等这张图，加载成功才显示，没有就不占位。
- **去一趟 H Mart**：番茄现在是不是真在货架上，然后把顶部那行「样张 · 未到店核实」整条删掉。上线前正文里没有任何「待核实」——这是硬前提，不是可选项。

---

## 5. 审计清单（在 App 仓库根目录跑）

每一条的目标是 0 命中，或者命中的每一处你能说出为什么留。

```bash
# 视口与高度
rg -n "user-scalable|maximum-scale" .
rg -n "100vh|h-screen|min-h-screen" src              # 改 dvh/svh，见 §2.3

# 悬停与动效
rg -n "hover:scale|scale-105|scale-110" src
rg -n "animate-bounce|animate-pulse" src
rg -n "hover:" src | wc -l                          # v3 未开 hoverOnlyWhenSupported 时，这个数就是会卡住的按钮数

# 卡片、药丸、模板色
rg -n "shadow-(sm|md|lg|xl|2xl)|drop-shadow" src
rg -n "rounded-full" src                             # 头像以外都该改
rg -n "rounded-(2xl|3xl)" src
rg -n "(emerald|green|teal|lime)-(100|400|500|600)" src
rg -n "(slate|zinc|gray|neutral)-(50|100|200)" src   # 冷灰底
rg -n "text-black|#000\b|#000000" src
rg -n "font-(bold|black|extrabold)" src              # 粗黑体大标题是模板味主源；标题改宋体 600

# 输入框与剪贴板
rg -n "text-(xs|sm)" src | rg -i "input|textarea|select"
rg -n "navigator\.clipboard" src                      # 每处都要有降级

# 文案
rg -n "润肺|润燥|清热|降火|去湿|祛湿|养胃|滋阴|温补|性味|排毒|免疫|减肥" src
rg -n "打卡|坚持|连续|解锁|成就|限时|仅今日" src
rg -n "打造|开启|探索|之美|精心|匠心|专属|为您|您的" src
rg -n "哦|呀|啦|亲|宝子|~|～" src --glob '*.{tsx,jsx,vue,ts,js,json}'
rg -n "热门|推荐|必吃|榜单|人气" src                 # 无数据支撑的社会证明
```

---

## 6. 实施顺序

| 步 | 内容 | 工时 | 依赖 |
|---|---|---|---|
| 1 | viewport meta 三行 + `base.css` 第 1–2 节（重置、安全区、输入框 16px、`color-scheme`） | 1 小时 | 无。做完立刻真机过 §2.8 的前两行 |
| 2 | hover 修正（Tailwind 一行 config）+ `:active` | 15 分钟 | 无 |
| 3 | token 接入（§2.7）+ `data-season` + 宋体加载 | 1–2 小时 | 无 |
| 4 | 按 §5 的 grep 逐条清：阴影 → 细线，药丸 → 文字标签，粗黑标题 → 宋体 600，灰白底 → 纸底 | 2–3 小时 | 步 3 |
| 5 | 文案：按 `copy.md` 重写表逐条替换；brand.yaml 的 zh 段落已同步更新 | 2 小时 | 无，**但要与步 4 同一次发布** |
| 6 | 动效：折叠改 grid `0fr→1fr`，弹层 `overscroll-behavior` | 30 分钟 | 步 3 |
| 7 | 真机矩阵 §2.8 全跑一遍，尤其微信最大字号与三星夜间模式 | 1 小时 | 步 1–6 |

**不做**：24 节气轮转；杂志摄影；任何功效文案；任何用"适量"代替数字的表头。

### 验收

- 320px 宽无横向滚动（`document.documentElement.scrollWidth <= clientWidth`）
- 刘海 iPhone：底栏在横条之上，主体最后一行不被盖
- iPhone SE：底部无多余空白
- 微信字体最大：无截断、按钮不折行
- 三星夜间模式：纸色仍是纸色
- 双指可放大；点输入框页面不自动缩放
- 秋季所有 < 24px 文字对比 ≥ 4.5:1（金粟色没出现在小字上）
- §5 文案类 grep 全部 0 命中
- `node lib/mos.mjs validate shilingshipu campaign-003` 仍为 0 FAIL（brand.yaml 新增了 banned_phrases）
