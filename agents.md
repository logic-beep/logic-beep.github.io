# agents.md — Personal Homepage（个人主页）项目开发指南

> 本文档用于辅助 **AI 开发者 / 协作者** 快速理解本仓库并安全地进行后续开发。
> 请先完整阅读本文，再进行任何代码修改；修改涉及动效时务必阅读「GSAP 动效约定」与「已知陷阱」。

---

## 1. 项目概述

一个**极客解谜 / 蓝图风格（GEEK · BLUEPRINT）**的个人主页（Portfolio）单页站点：

- 浅灰底色（#F2F3F5）+ 亮宝蓝主色（#0055FF）+ 深灰实线 / 虚线框 + 像素切角装饰
- 细线电路板风格 SVG 背景（Circuit：走线 + 钻石节点 + 虚线框）+ 自定义 SVG 鼠标光标（默认箭头 / 悬停靶圈）+ tech-grid 网格叠加
- 顶部固定 Tab 导航栏（0x00~0x04 编码 + scroll-spy 激活发光 + 复选框组 + 底部扫描线）
- 通用复选框组件（`geek-checkbox`，像素角 + hover 蓝色发光 + 点击弹跳动画 `checkboxPop`）
- 每个区块在滚动时用 GSAP ScrollTrigger 播放入场 / 视差动画
- 文案为中英混排的「任务清单 / 解谜游戏」口吻（如 `TASK_00 / QUEST_01_ACTIVE / USER_DOSSIER / BUILD:PASSED`）
- HUD 四角面板改为任务状态：TASK.LIST / QUEST / SYS.LOG / PROGRESS / CLOCK / LVL / HINT
- 内容（人名、邮箱、作品、数据等）目前多为**模板占位内容**，随时可替换为真实信息

| 项 | 值 |
| --- | --- |
| 技术栈 | React 18 + TypeScript 5.5（strict）+ Vite 5 + SCSS(Dart Sass) |
| 动效 | GSAP 3 + ScrollTrigger + `@gsap/react`（useGSAP） |
| 字体 | `@fontsource` 本地引入（Orbitron / Rajdhani / Space Mono / Press Start 2P / VT323）——大字粗黑 Orbitron 900、小字等宽 Space Mono、像素装饰 Press Start 2P |
| 部署 | GitHub Actions → GitHub Pages（仓库 `logic-beep/logic-beep.github.io`，站点在根路径） |
| 语言 | 页面 `lang="zh-CN"`，标题 `CYBER.PORTFOLIO // v2.077`（index.html 标题可同步改） |
| 其他 | 无路由、无状态库、无测试、无 ESLint/Prettier 配置 |

---

## 2. 常用命令

```bash
npm install          # 安装依赖（lockfile 已存在，建议用 npm ci）
npm run dev          # 启动 Vite dev server，端口 5173，自动开浏览器
npm run build        # 类型检查(tsc -b) + 产物构建到 dist/
npm run preview      # 本地预览构建产物
npx tsc -b           # 仅类型检查（CI 的 ci job 也会执行）
```

> 提交前请确保 `npm run build` 通过 —— 与 CI（Type Check & Build）行为一致。
> 仓库中**没有** `dist/` 提交（已在 .gitignore），不要手动改 `dist/`。

---

## 3. 目录结构

```
├── agents.md                   # 本文档：AI/协作者开发指南
├── README.md                   # 项目简介 + 常用命令 + 内容维护入口
├── index.html                  # HTML 入口：lang=zh-CN、SEO/OG meta、favicon 链接、标题
├── public/favicon.svg          # 站点图标
├── vite.config.ts              # Vite 配置：react 插件、端口 5173、产物路径 js/ css/ assets/
├── tsconfig*.json              # strict、noUnusedLocals/Parameters；app + node 双工程引用
├── .github/workflows/deploy-pages.yml   # CI + GitHub Pages 部署
└── src/
    ├── main.tsx                # 入口：字体 CSS → main.scss → <App/>（StrictMode）
    ├── App.tsx                 # 根组件：注册 ScrollTrigger、通用 section 视差、组装 <NavBar/> + 各区块
    ├── utils/motion.ts         # prefers-reduced-motion 检测（REDUCED_MOTION 常量）
    ├── vite-env.d.ts
    ├── components/
    │   ├── navigation/
    │   │   └── NavBar.tsx      # ★ 顶部 Tab 导航栏：0x00~0x04 编码、scroll-spy、复选框组、入场 GSAP（↔ _navbar.scss）
    │   ├── sections/           # 5 个内容区块，一一对应 styles 里的 partial
    │   │   ├── Hero.tsx        #    首页大标题 + TASKLIST.txt 真实勾选任务清单 + 滚动指示（↔ _hero.scss）
    │   │   ├── About.tsx       #    头像框（双层虚线+连接箭头）+ USER_DOSSIER 简介 + 统计（每项带 mini 复选框）（↔ _about.scss）
    │   │   ├── Skills.tsx      #    TOOLBOX 技能卡片（TL/BR 角装饰 + 百分比旁 mini 复选框）（↔ _skills.scss）
    │   │   ├── Works.tsx       #    精选项目列表（BLUEPRINT/NODE.MAP/PIXEL.QUEST）（↔ _works.scss）
    │   │   └── Contact.tsx     #    QUEST_LIST.txt + 邮箱 + CONTACT_CHANNELS 联系方式网格 + 页脚（↔ _contact.scss）
    │   └── decorations/
    │       └── Decorations.tsx # 固定全屏装饰层：CircuitSVG（电路板细线 + 钻石节点 + 虚线框）+ 10 颗 decorations__node 呼吸视差 + HUD 四角任务面板（↔ _decorations.scss）
    └── styles/                 # 全部样式；main.scss 通过 @use 按序聚合
        ├── main.scss           # 聚合入口（use 顺序即编译顺序），末尾新增 @use 'navbar'
        ├── _variables.scss     # ★ 设计变量：浅灰背景层 / 亮宝蓝三级强调 / 深灰四级线条 / 文本四级 / 间距/断点/缓动/z-index / pixel 切角 / glow 发光尺寸
        ├── _mixins.scss        # ★ 复用混入：respond-to、pixel-corner、tech-grid、glow-text/glow-box、checkbox-geek、tab-nav、geek-panel、dashed-border、circuit-pattern、gradient-blue-text、corner-brackets-dashed
        ├── _navbar.scss        # ★ NavBar 样式：fixed 毛玻璃、顶部蓝黑交替条、tab is-active、复选框组、底部扫描动画
        ├── _base.scss          # reset、body 背景层(tech-grid)、自定义 SVG 光标(默认+悬停)、.section 通用结构+顶部分刻线、.section-label☐前缀+钻石、.geek-checkbox 与 checkboxPop 动画、::-webkit-scrollbar
        └── _<section>.scss     # 各区块样式 + decorations.scss
```

**每个区块的固定骨架（务必保持一致）：**

```tsx
<section ref={container} className="section hero" id="hero">
  <div className="section-bg hero-bg" />            {/* 视差背景层，GSAP 驱动 */}
  <div className="section-content hero-content">    {/* 内容层，全局 .section-content 已限宽居中 */}
    ...
  </div>
</section>
```

- `.section`（_base.scss）：`min-height:100vh`、flex 垂直居中、顶部虚线刻度/渐变分隔装饰
- `.section-bg`：`absolute` 铺满、`z-index:-1`、`pointer-events:none`，多由浅灰径向渐变 + tech-grid 组成背景
- `.section-content`：`max-width:1440px` 居中，响应式内边距
- 区块标题统一用 `.section-label`（含 `☐` 前缀伪元素 + 右上角钻石 ◆ 高亮），按区块追加修饰类 `section-label--hero/about/skills/works/contact`
- 新增 NavBar（_navbar.scss）：fixed 顶部、高度 72px、`z-nav: 100`；App.tsx 中 `.app` 有 `padding-top: 72px` 避让；scrollTo 锚点跳转需减去 72px

---

## 4. 设计与样式系统（改样式前必读）

### 4.1 变量（`_variables.scss`）
- **背景层**（浅灰体系）：`$bg-page:#F2F3F5` / `$bg-surface:#FFFFFF` / `$bg-panel:#F7F8FA` / `$bg-muted:#EBEDF0` / `$bg-input / $bg-hover` + `$gradient-panel`
- **主蓝色（强调色三级）**：`$blue-primary:#0055FF` / `$blue-dark:#0044CC` / `$blue-light:#3377FF`
- **深灰线条四级**：`$line-1:#1A1A2E` / `$line-2:#3A3A4C` / `$line-3:#5A5A6C` / `$line-4:#8A8A9C` + `$line-muted` + `$line-thin:1px / $line-thick:2px`
- **文本四级**：`$text-primary / $text-secondary / $text-tertiary / $text-muted` + `$text-invert:#FFFFFF`（蓝底反色）
- **状态色**：`$success / $warning / $error / $info`（Hero/Contact 任务清单圆点用）
- **字体分类**（与原命名不同！别再用 `$font-display/$color-void/$neon-*`）：
  - `$font-heading`: Orbitron（粗黑体大字）
  - `$font-mono`: Space Mono（等宽小字/代码感）
  - `$font-pixel`: Press Start 2P（像素装饰/竖排编码）
  - `$font-body`: Rajdhani（正文）
- **像素/发光**：`$pixel:4px / $pixel-2:8px / $pixel-3:12px`（pixel-corner 切角尺寸）；`$glow-sm:4px / $glow-md:12px / $glow-lg:24px`（hover 蓝色发光半径）
- **其余**：间距 `$spacing-xs…xxl`、断点 `$bp-sm…xxl`(640/768/1024/1280/1536)、缓动 `$ease-geek / $ease-pixel / $ease-bounce`、z-index（`$z-nav:100 / $z-decor:50` 等）

> **改颜色/字体/间距/线条时，一律只改 `_variables.scss`，不要在区块样式里硬编码色值。**
> 文字发光用 `@include glow-text($blue-primary, $glow-sm)`；盒发光 `@include glow-box($blue-primary, $glow-md)`；
> 禁止使用已删除的旧变量：`$neon-* / $color-void / $color-text* / $font-display / $ease-cyber / cyber-grid / scanlines`—— Sass 编译会直接报错。

### 4.2 Mixins（`_mixins.scss`）
- `respond-to($bp)`：**min-width 移动优先**断点
- `max-width`：内容限宽居中
- `pixel-corner($size)`：clip-path 阶梯状像素切角边框（4/8/12px 三级）
- `tech-grid($color, $size)`：SVG pattern 风格的蓝色细网格背景（替代原 cyber-grid）
- `glow-text($accent, $size)` / `glow-box($accent, $size)`：蓝色发光 text-/box-shadow
- `gradient-blue-text`：主蓝→浅蓝斜向渐变文字（section 标题高亮）
- `checkbox-geek($accent)`：20px 像素角复选框（hover 发光 / `.is-checked` 填充蓝+描边勾）
- `tab-nav`：NavBar Tab 的 mono uppercase + is-active 底部高亮发光线
- `geek-panel`：白底面板 + 实线外框 + 内虚线 + 斜叠蓝色背景层（Hero TASKLIST / Contact QUEST_LIST 复用）
- `dashed-border($accent, $inset)`：`inset: Npx` 的内虚线框（hover 显示/works visual 内部）
- `line-border($accent)`：实线外框 + 像素切角
- `circuit-pattern`：电路板走线重复背景
- `corner-brackets-dashed`：四角 L 形虚线括号装饰

### 4.3 关键通用类
- **`.geek-checkbox`**（_base.scss）：20px 像素角通用复选框原子类。**交互方式**：组件内 `useState` 管理真假，渲染时加/去 `.is-checked`；**点击动画**：在 DOM 元素上临时加 `.animate-check` 350ms（触发 `@keyframes checkboxPop` bounce）。Hero 任务清单为真实交互，其余为装饰只读。
- **`.geek-checkbox--mini`**（_skills.scss）：12px 迷你版，用于 Skills 百分比右侧、About stats 行首。
- **`.section-label`**（_base.scss）：含 `☐ ` 前缀伪元素 + 右上角 `◆` 钻石旋转高亮 + dashed 底部刻度线
- **`.hl`**：段落内高亮关键词（各区块样式文件内定义为 `$blue-primary` + `glow-text`）
- **纯 CSS 关键帧**（_base.scss / 各 section scss 末尾）：`checkboxPop` / `labelBlink` / `cursorBlink` / `heartbeat` / `navbarScan` / 呼吸 `nodePulse` 等 —— 每个都需配套 `@media (prefers-reduced-motion: reduce)` 降级覆盖
- **自定义光标**（_base.scss）：`body { cursor: url('data:image/svg+xml,…箭+蓝描边') 2 2, auto }`；`a, button, [role="button"], .contact__social-link, .works__text-link` 等可交互元素切为悬停靶圈 SVG URI；新增交互元素若要光标变化，列到 `_base.scss` 悬停选择器中

### 4.4 字体
全部经 `@fontsource/*` 在 `main.tsx` 按 latin 子集引入（无外链、随包构建）。**中文/日文**字形不在 fontsource latin 子集内，回退到系统字体 —— 标题类文字尽量保持英文大写风格。字重分配：
- Orbitron 900 用于 `font-heading` 主标题；Orbitron 400/600/700 用于副标题、按钮、NavBar
- Space Mono 400/700 用于所有标签、mono 文案（section-label / HUD / TASKLIST 内部）
- Press Start 2P 400 用于 NavBar 版本号 `v2.1`、社交卡片竖排 `0x01~0x04`、页脚小字

---

## 5. GSAP 动效约定（最重要）

### 5.1 统一模式
每个组件在文件内 `useRef` 容器 + `useGSAP(..., { scope: container })`：

```tsx
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const container = useRef<HTMLElement>(null)
useGSAP(() => { /* 动画，选择器只写类名 */ }, { scope: container })
return <section ref={container} className="section hero" id="hero">…</section>
```

- `scope` 使类名选择器只在容器内生效，React 卸载时自动 `revert`（StrictMode 双挂载安全）
- `gsap.registerPlugin(ScrollTrigger)` **只在 `App.tsx` 模块顶层执行一次**；各区块组件直接使用 `scrollTrigger` 配置，无需各自注册（也不要在模块顶层重复注册）
- 三类动画手法在本项目中并存，注意区分：
  1. **入场 timeline**：`gsap.timeline({ scrollTrigger:{ trigger:container, start:'top 70%', toggleActions:'play none none reverse' }, defaults:{ ease:'power3.out' } })`，配合 `tl.from('.xx', {...}, offset)`
  2. **滚动视差（scrub）**：`gsap.to(bg, { yPercent, scrollTrigger:{ trigger, start:'top bottom', end:'bottom top', scrub:1 } })`
  3. **Hero 开场**：进入页面立即播放的 `tl.to(...)` 时间线（见下）

### 5.2 Hero 的特殊「CSS 隐藏态 + to 揭示」耦合
`_hero.scss` 中若干元素**初始即隐藏**（`opacity:0; transform:translateY(30px)`；标题两行 `transform:translateY(100%)` 藏在 `.hero__title-line{overflow:hidden}` 内），`Hero.tsx` 的时间线用 `tl.to('.hero__xx', { y:0, opacity:1 })` 依次揭示。Hero 新增了真实交互的 `TASKLIST.txt` 复选框（`useState` + `.geek-checkbox.is-checked`），点击时通过 `.animate-check` class 触发 350ms `checkboxPop` bounce。

⚠️ **陷阱：**
- 删除这些 CSS 初始态会让开场动画"闪现"失效；删除 JS 会让内容**永久不可见**
- 在 Hero 内**新增**元素时，若想参与开场动画，请同时在 CSS 中给初始隐藏态并加入 timeline；否则保持默认可见即可
- About/Skills/Works/Contact 使用 `tl.from`（CSS 不隐藏），与 Hero 不同，别混用
- Hero 新增参与开场动画的元素后，**同步在 `_hero.scss` 末尾的 `prefers-reduced-motion` 覆盖**中强制显示，否则降级模式下内容消失

### 5.3 数据驱动动画
- **数字滚动**（About）：`.num` 元素带 `data-num`（目标值）与 `data-suffix`（后缀），GSAP `textContent` + `snap` + `onUpdate` 拼接后缀，`start:'top 55%'` 触发。**新增统计项必须同时提供两个 data 属性**
- **技能条**（Skills）：`.skills__card-level-fill` 初始 `width:100%`，用 `scaleX: level/100`（内联 `transformOrigin:'left'`）填充；进度值来自组件顶部 `skills` 数组的 `level` 字段，**数组顺序与 DOM 渲染顺序一一对应**（回调按 index 取 `skills[i].level`）

### 5.4 视差背景 / 装饰层
`App.tsx` 遍历所有 `.section` 通用做背景/内容 scrub 视差；`Decorations.tsx` 内：
- **CircuitSVG（电路板）** 单张 1200×800 viewBox SVG 做 `scrub:1.5` 全页滚动视差（11 个钻石 `<rect>` 节点配合自身 `@keyframes` 旋转/呼吸）
- **10 颗 `.decorations__node`** 固定在页内 x/y 位置，做独立 `nodePulse` 呼吸，同时被 scrub 轻微位移
任何区块的布局高度变化后需要刷新：App 已在挂载后调用 `ScrollTrigger.refresh()`；若动态改变内容高度，记得补调。

### 5.5 NavBar scroll-spy（不使用 ScrollTrigger，用 window.scroll）
`NavBar.tsx` 组件内 `useEffect` 绑 `window.scroll`，计算 `window.scrollY + 120` 落到 5 个 section 的 `offsetTop/offsetHeight` 区间内，映射 `activeId` 高亮对应 Tab。点击 tab 时 `scrollTo({ top: section.offsetTop - 72 })` —— 72px 是 NavBar 高度，避免遮盖标题。**新增 section 时要同步在 navItems 数组中加条目 + 给 NavBar 的 section id 映射。**

---

### 5.5 无障碍降级（prefers-reduced-motion）—— 新增动画必读
全站支持系统级「减少动态效果」：

- JS 侧：`src/utils/motion.ts` 导出常量 `REDUCED_MOTION`。所有入场 timeline / scrub 视差 /
  循环动画 / Canvas 数字雨在使用前先 `if (REDUCED_MOTION) return`（或按需静态兜底，
  如 Skills 直接把技能条 `gsap.set` 到最终比例、Hero 跳过开场）。统计数字静态值已在 JSX 中。
- CSS 侧：`_base.scss` 末尾媒体查询把纯 CSS 动画（checkboxPop / labelBlink / cursorBlink / heartbeat / navbarScan / nodePulse …）
  收敛为静态；`_hero.scss` 末尾有配套覆盖——把 Hero 的「CSS 初始隐藏态」元素强制显示
  （跳过 JS 揭示时内容不能消失）。**给 Hero 新增参与开场动画的元素时，必须同步更新该覆盖。**
- 社交/联系方式卡片中新增纯 CSS 过渡（hover 发光 / translateY）不受影响，但新增关键帧必须在 section scss 末尾 `@media (prefers-reduced-motion: reduce) { animation: none }` 兜底。

> 开发/调试小贴士：Chrome DevTools Rendering 面板勾选 `Emulate CSS prefers-reduced-motion: reduce`
> 即可快速验证降级效果。

## 6. 组件与内容数据（改文案/作品/技能位置）

| 内容 | 位置 | 说明 |
| --- | --- | --- |
| 页面标题/描述/图标 | `index.html` + `public/favicon.svg` | `<title>`、SEO/OG meta、canonical（当前指向 `https://logic-beep.github.io/`）—— 目前标题仍为旧风格 `CYBER.PORTFOLIO // v2.077`，可按需改为 `GEEK.DEV // v2.1` 等 |
| 顶部 NavBar Tab + 复选框 + 版本号 | `NavBar.tsx` | `navItems` 数组（id/label/code: `0x00~0x04`）；右侧 `checkboxes` 装饰；logo `GEEK.DEV` 与 `v2.1` 像素版本号。scroll-spy 与 click scrollTo 72px 偏移在此组件 |
| Hero 文案 / TASKLIST | `Hero.tsx` | 问候语 `boot.system()`、两行标题、副标题、meta、**`tasks` 数组（真实勾选交互，复选框 `.animate-check` 350ms）** |
| About 文案/统计 | `About.tsx` | USER_DOSSIER 中文简介段落 + `.about__visual-connections`（两条虚线箭头+钻石节点） + `.about__text-stats-item` 的 `data-num/data-suffix` + 每项行首 `geek-checkbox is-checked` 装饰 |
| 技能卡片 | `Skills.tsx` 顶部 `skills` 数组 | title/desc/level/levelLabel/icon(SVG JSX)；每张卡片左上/右下 L 形角 `.skills__card-corner-tl/br`；百分比右侧 `.geek-checkbox--mini is-checked`；新增条目自动进网格 |
| 项目列表 | `Works.tsx` 顶部 `works` 数组 | num/badge/title（BLUEPRINT / NODE.MAP / PIXEL.QUEST）/desc/tags/previewClass/hud/**url(可选)** |
| 联系邮箱 / QUEST / 社交 | `Contact.tsx` | `mailto:` 邮箱；**`quests` 数组（3 条 quest + 闪烁光标 prompt）**；`socials` 数组（label/code:0x01~0x04/Icon/**href(可选)**）；联系方式网格 + 竖排像素编码 |
| HUD 角标文本 + 电路板 SVG | `Decorations.tsx` 的 `HUDCorners` 与 `CircuitSVG` | HUD: TASK.LIST / QUEST_01_ACTIVE / STATUS / SYS.LOG / PROGRESS / CLOCK / LVL / HINT；右下角 `#hud-time` 每秒 JS 更新；CircuitSVG（1200×800 走线/11钻石/5虚线框）可在此替换尺寸或加节点 |

- **`Works` 的 `previewClass`**（`works__visual-preview--1/2/3`）是纯 CSS 渐变/图案缩略图（无图片资源）。新增作品：给数组加对象，并到 `_works.scss` 增加对应的 `--N` 样式类，否则缩略图无样式
- **Works 的 `url` 与 Contact `socials` 的 `href` 均为可选字段**：缺省时渲染 `--disabled` 禁用态（弱化、不可点击），**不要再写 `href="#"`**（点击会跳回页面顶部）。GitHub 社交链接已填 `https://github.com/logic-beep`；其余链接填入真实地址后自动变为可点击外链
- 描述文案可中英混排；`hl` 包裹关键词可获得 `$blue-primary` + glow-text 高亮
- 新增/删除 Hero 的任务清单或 Contact 的 quest：同步给 checked state 初始化对象加 key，以及 useGSAP 入场 `tl.from` 选择器
- 注意：Skills 列表 key、Works key 用数组索引（`key={i}`），有序静态数据可接受

---

## 7. 新增/调整区块的 SOP

新增一个区块（例如 `Pricing.tsx` / `Blog.tsx`）时按以下步骤，保持项目一致性：

1. 创建 `src/components/sections/<X>.tsx`：
   - 复制现有区块骨架（section → section-bg → section-content）
   - `useGSAP` 内部定义入场 timeline（`from`）与视差，选择器全部作用域内类名
   - 图标等小 SVG 组件直接在文件内定义
2. 创建 `src/styles/_<x>.scss`，开头 `@use 'variables' as *; @use 'mixins' as *;`
3. 在 `styles/main.scss` 末尾 `@use '<x>';`（顺序影响层叠，注意与现有区块的相对覆盖关系）
4. 在 `App.tsx` 中 `import` 并在 `<main>` 内按页面顺序放置（id 锚点同时生效）
5. **同步更新 `NavBar.tsx` 的 `navItems` 数组**：追加新条目（label + code: `0x05/0x06`…），并在 scroll-spy 的 section 映射中包含新 id，否则新 Tab 不会被 scroll-spy 激活，点击时 scrollTo -72px 偏移也不会生效
6. 若需要区分配色/主题，优先追加变量或对区块加修饰类，避免污染全局类
7. `npm run build` 验证类型与产物；push 到 main 触发 CI + 自动部署

新增 **Decorations**（视觉装饰元素）同理：改 `Decorations.tsx` + `_decorations.scss`；容器是 `aria-hidden="true"` 的 fixed 层，不承载语义内容。
新增 **NavBar Tab** 或复选框装饰：改 `NavBar.tsx` + `_navbar.scss`；NavBar 高度变化后要同步修改 App.tsx 中 `.app` 的 `padding-top` 与所有 scrollTo 偏移（-72px → -新高度）。

---

## 8. CI / CD 与部署

`.github/workflows/deploy-pages.yml`（push 到 `main|master` / PR / 手动触发）：

1. `ci` job：`actions/checkout@v4` → Node 22 + npm cache → `npm ci` → **`npx tsc -b`（类型检查）** → `npm run build` → `cp dist/index.html dist/404.html`（SPA 404 兜底）→ 上传 `dist-artifact`
2. `deploy` job（非 PR）：下载产物 → `upload-pages-artifact@v3` → `deploy-pages@v4`

**base 路径**：`vite.config.ts` 未设置 `base`，当前仓库为 **user Pages**（`logic-beep.github.io`，根路径部署）所以默认 `/` 正确。若迁移到「项目 Pages」仓库（`<user>.github.io/<repo>/`），必须把 `base` 改为 `/<repo>/`（或 `'./'`），否则资源路径 404。

---

## 9. 已知问题与改进建议

### 已完成的改进（勿重复做）
1. **favicon 404** → 已新建 `public/favicon.svg` 并更新 `index.html`
2. **无障碍动效偏好** → 已全站支持 `prefers-reduced-motion`（`_base.scss`/各 section scss 末尾媒体查询 + 各组件 `REDUCED_MOTION` 分支，见 5.5）
3. **SEO/OG meta** → 已补 description / OG / Twitter / canonical；`og:url` 与 `canonical` 目前写死 `https://logic-beep.github.io/`，更换域名时需同步修改
4. **占位链接去风险** → Works `url` / Contact `socials` 的 `href` 缺省渲染禁用态，不再有跳回顶部的 `#` 链接；GitHub 已按仓库远端填写
5. **README 缺省** → 已新建 `README.md`
6. **字体本地自托管** → 已从 Google Fonts CDN 迁移至 `@fontsource/*` 本地构建（Orbitron/Rajdhani/SpaceMono/PressStart2P/VT323 按 latin 子集 ES import 进 `main.tsx`，Vite 自动 hash 打包到 `dist/assets`）
7. **顶部 NavBar Tab 导航栏** → 已新建 `NavBar.tsx` + `_navbar.scss`，实现：0x00~0x04 编码 Tab、scroll-spy 激活、GSAP 入场、右侧复选框组+底部扫描线、scrollTo -72px 偏移；App.tsx 中 `.app padding-top:72px` 避让
8. **完整风格重构：赛博霓虹 → 极客蓝图** → 浅灰背景 `#F2F3F5` / 亮宝蓝 `#0055FF` / 深灰实线+虚线四级；复选框组件 `.geek-checkbox`（含 mini 12px 版与 `checkboxPop` 点击弹跳）；细线电路板 `CircuitSVG`；自定义 SVG 鼠标光标（默认/悬停两态）；Hero/About/Skills/Works/Contact + HUD 四角文案全部改为「TASKLIST/QUEST/USER_DOSSIER/TOOLBOX/BLUEPRINT/PAIR_PROGRAMMING_MODE」解谜游戏口吻
9. **微交互全覆盖** → Skills 卡片 hover translateY+scale+蓝色发光 / Works 斜向光扫 `::after sweep`+内虚线框显示 / Tags 悬停蓝发光 / Email 按钮反色大发光 / NavBar Tab 激活 / 联系方式卡片 hover 虚线内框显示

### 剩余建议（非阻塞）
1. **占位内容替换**：邮箱 `hello@geek.dev`、作品描述/统计数字/简介仍为模板内容；接入真实资料后对应链接会自动激活（按第 6 节位置修改）
2. **无测试/静态检查**：目前只有 `tsc` strict 把关，CI 不跑 lint；如需可引入 ESLint/Prettier（需新增依赖与脚本，先讨论）
3. **NavBar 移动端**：`bp-sm (640px)` 以下当前 tabs `display:none`，用户无法跳转 —— 可加汉堡菜单或紧凑排版（至少保留可点击 Tab 的折叠版）
4. **index.html 标题与 meta**：目前 `<title>` 仍为旧的 `CYBER.PORTFOLIO // v2.077`，description/keywords/og:title 仍写「赛博朋克」，可同步改成「GEEK.DEV // v2.1 · 极客蓝图风格作品集」
5. **功能扩展候选**：亮/暗主题切换、i18n、博客/时间线区块、Works 预览改真实图片（目前是纯 CSS 渐变占位）—— 先讨论再动手，遵循第 7 节 SOP
6. **Dart Sass 2.0 兼容**：构建时有 `legacy-js-api` deprecated warning，可升级到 Sass 现代 `@use "sass:map"` 等新 API 替换（非紧迫）

---

## 10. AI 辅助开发红线（务必遵守）

- ✅ 改前先 `read` 目标文件，遵循既有结构；改完跑 `npm run build` 自检（tsc strict + Vite 产物）
- ✅ **颜色/断点/字体/线条/发光一律走 `_variables.scss`，避免魔法值**；新效果优先用 `_mixins.scss` 已有混入（`pixel-corner / tech-grid / glow-text / glow-box / geek-panel / checkbox-geek / dashed-border`）
- ✅ **绝对禁止使用已删除的旧变量与 mixin**（Sass 会直接报错）：`$neon-* / $color-void* / $color-text* / $font-display / $ease-cyber / neon-glow / neon-box-glow / cyber-grid / scanlines / gradient-neon / cyber-panel / glitch-text / corner-brackets（非 dashed 版）`
- ✅ 动效选择器限制在 `useGSAP scope` 内；`data-num/data-suffix` 与对应数字滚动 JS 必须成对出现
- ✅ 新增任何 JS 动效 / SVG 循环 / 装饰层呼吸动画必须处理 `REDUCED_MOTION` 降级（见 5.5）；给 Hero 新增「初始隐藏」元素时同步补 `_hero.scss` 的 reduce 覆盖，否则降级模式下内容不可见
- ✅ **复选框组件约定**：真实交互用 `useState` 控 `.is-checked`，点击动画用 DOM 上临时加 `animate-check` 350ms；装饰只读复选框（About stats/Skills mini）直接同时加 `.geek-checkbox + .is-checked` 静态类，不要走 state
- ✅ **自定义光标约定**：新增可点击元素若不是 `a/button`，需同时写到 `_base.scss` 光标选择器列表里，否则 hover 仍显示默认指针
- ✅ **NavBar 强约定**：新增/删除 section 必须同步修改 `NavBar.tsx` 的 `navItems` 数组 + scroll-spy 区间映射；点击跳转锚点永远减去 NavBar 实际高度（当前 72px，NavBar 改高度后要同步改 App padding-top 与所有 offset 偏移）
- ✅ Works/Contact 占位链接一律用可选 `url`/`href` 字段 + `--disabled` 禁用态渲染，**禁止写 `href="#"`**
- ✅ 保持 StrictMode 兼容：effect 内资源（rAF/interval/监听器/window.scroll）必须有清理；GSAP 动画统一走 `useGSAP`（自动 revert）；NavBar 的 `window scroll` 事件 useEffect 返回 cleanup `removeEventListener`
- ❌ 不要改/提交 `dist/`（git-ignored、CI 生成）、`package-lock` 除非确需加依赖
- ❌ 不要擅自引入路由/状态管理/新大依赖；确有需要先在对话中提出
- ❌ 不要删除「CSS 初始隐藏态 ↔ GSAP to 揭示」的配对（见 5.2），会导致 Hero 开场失效或内容不可见
- ❌ 不要破坏装饰层语义：`Decorations` 固定全屏且 `pointer-events:none`，勿把交互内容放进去；交互按钮/Tab/复选框放 NavBar 或各 sections 内
- ❌ 中文字符串默认 UTF-8；文件内混排文案遵循既有「前缀任务编码 + 中文正文」风格（如 `TASK_00: 初始化项目 ✓`），别引入英文直译腔
