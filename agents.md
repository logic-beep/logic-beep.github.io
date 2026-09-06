# agents.md — Personal Homepage（个人主页）项目开发指南

> 本文档用于辅助 **AI 开发者 / 协作者** 快速理解本仓库并安全地进行后续开发。
> 请先完整阅读本文，再进行任何代码修改；修改涉及动效时务必阅读「GSAP 动效约定」与「已知陷阱」。

---

## 1. 项目概述

一个**赛博朋克 / 霓虹像素风**的个人主页（Portfolio）单页站点：

- 深空紫黑底色 + 霓虹发光 + 故障（Glitch）文字 + 像素风装饰 + HUD 界面元素
- 全屏 Canvas「数字雨」背景 + 浮动霓虹光斑 + 扫描线覆盖层
- 每个区块在滚动时用 GSAP ScrollTrigger 播放入场 / 视差动画
- 文案为中英混排的「赛博系统」口吻（如 `Initializing System... // Hello, I am`）
- 内容（人名、邮箱、作品、数据等）目前多为**模板占位内容**，随时可替换为真实信息

| 项 | 值 |
| --- | --- |
| 技术栈 | React 18 + TypeScript 5.5（strict）+ Vite 5 + SCSS(Dart Sass) |
| 动效 | GSAP 3 + ScrollTrigger + `@gsap/react`（useGSAP） |
| 字体 | `@fontsource` 本地引入（Orbitron / Rajdhani / Space Mono / Press Start 2P / VT323） |
| 部署 | GitHub Actions → GitHub Pages（仓库 `logic-beep/logic-beep.github.io`，站点在根路径） |
| 语言 | 页面 `lang="zh-CN"`，标题 `CYBER.PORTFOLIO // v2.077` |
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
├── public/favicon.svg          # 站点图标（霓虹风格，替代原 vite.svg 404）
├── vite.config.ts              # Vite 配置：react 插件、端口 5173、产物路径 js/ css/ assets/
├── tsconfig*.json              # strict、noUnusedLocals/Parameters；app + node 双工程引用
├── .github/workflows/deploy-pages.yml   # CI + GitHub Pages 部署
└── src/
    ├── main.tsx                # 入口：字体 CSS → main.scss → <App/>（StrictMode）
    ├── App.tsx                 # 根组件：注册 ScrollTrigger、通用 section 视差、组装各区块
    ├── utils/motion.ts         # prefers-reduced-motion 检测（REDUCED_MOTION 常量）
    ├── vite-env.d.ts
    ├── components/
    │   ├── sections/           # 5 个内容区块，一一对应 styles 里的 partial
    │   │   ├── Hero.tsx        #    首页大标题 + 终端卡片 + 滚动提示（↔ _hero.scss）
    │   │   ├── About.tsx       #    头像框 + 简介 + 数字统计（↔ _about.scss）
    │   │   ├── Skills.tsx      #    技能卡片网格（↔ _skills.scss）
    │   │   ├── Works.tsx       #    精选项目列表（↔ _works.scss）
    │   │   └── Contact.tsx     #    联系 CTA + 社交链接 + 页脚（↔ _contact.scss）
    │   └── decorations/
    │       └── Decorations.tsx # 固定全屏装饰层：数字雨 canvas、霓虹光斑、HUD 四角（↔ _decorations.scss）
    └── styles/                 # 全部样式；main.scss 通过 @use 按序聚合
        ├── main.scss           # 聚合入口（use 顺序即编译顺序）
        ├── _variables.scss     # ★ 设计变量：颜色/字体/间距/断点/缓动/z-index
        ├── _mixins.scss        # ★ 复用混入：respond-to、neon-glow、pixel-*、cyber-*、glitch-text…
        ├── _base.scss          # reset、body 背景层(网格+扫描线)、.section 通用结构、glitch 动画
        └── _<section>.scss     # 各区块样式
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

- `.section`（_base.scss）：`min-height:100vh`、flex 垂直居中、顶部渐变色条伪元素
- `.section-bg`：`absolute` 铺满、`z-index:-1`、`pointer-events:none`，多由径向渐变组成背景
- `.section-content`：`max-width:1440px` 居中，响应式内边距
- 区块标题统一用 `.section-label`（含 `>` 前缀伪元素），按区块追加修饰类 `section-label--hero/about/skills/works/contact`

---

## 4. 设计与样式系统（改样式前必读）

### 4.1 变量（`_variables.scss`）
- 配色：深色底 `$color-void/#05010F` 系（void/abyss/deep/panel…）；文本三级 `$color-text / -dim / -faint`；霓虹强调色 `$neon-cyan / -magenta / -violet / -lime / -yellow…`
- 渐变预设：`$gradient-neon-cm`（青→品红）等 7 个
- 字体：`$font-display`(Orbitron) / `$font-body`(Rajdhani) / `$font-mono`(Space Mono) / `$font-pixel`(Press Start 2P)
- 间距 `$spacing-xs…xxl`、断点 `$bp-sm…xxl`(640/768/1024/1280/1536)、缓动 `$ease-cyber/-pixel/-jitter`、z-index、像素值/发光模糊尺寸

> **改颜色/字体/间距时，一律只改 `_variables.scss`，不要在区块样式里硬编码色值。**
> 文字发光用 `@include neon-glow($color, $size)`；盒发光 `neon-box-glow`。

### 4.2 Mixins（`_mixins.scss`）
- `respond-to($bp)`：**min-width 移动优先**断点
- `max-width`：内容限宽居中
- `pixel-border / pixel-corner`：clip-path 像素切角边框
- `cyber-grid`：网格背景；`scanlines`：扫描线覆盖
- `gradient-neon`：渐变文字；`cyber-panel`：毛玻璃面板 + 像素角；`corner-brackets`：四角括号

### 4.3 关键通用类
- `.glitch-text`（_base.scss）：伪元素读取元素的 **`data-text` 属性**复制内容做 RGB 分离故障动画 —— **使用它时必须同时提供 `data-text`**，且需自带 `position:relative` 上下文
- `.hl`：段落内高亮关键词（各区块样式文件内各自定义颜色/发光）
- `.neon-flicker`：霓虹闪烁动画
- 伪元素大量承担装饰，注意保持语义结构干净

### 4.4 字体
全部经 `@fontsource/*` 在 `main.tsx` 按 latin 子集引入（无外链、随包构建）。**中文/日文**字形不在 fontsource latin 子集内，回退到系统字体 —— 标题类文字尽量保持英文大写风格。

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
`_hero.scss` 中若干元素**初始即隐藏**（`opacity:0; transform:translateY(30px)`；标题两行 `transform:translateY(100%)` 藏在 `.hero__title-line{overflow:hidden}` 内），`Hero.tsx` 的时间线用 `tl.to('.hero__xx', { y:0, opacity:1 })` 依次揭示。

⚠️ **陷阱：**
- 删除这些 CSS 初始态会让开场动画"闪现"失效；删除 JS 会让内容**永久不可见**
- 在 Hero 内**新增**元素时，若想参与开场动画，请同时在 CSS 中给初始隐藏态并加入 timeline；否则保持默认可见即可
- About/Skills/Works/Contact 使用 `tl.from`（CSS 不隐藏），与 Hero 不同，别混用

### 5.3 数据驱动动画
- **数字滚动**（About）：`.num` 元素带 `data-num`（目标值）与 `data-suffix`（后缀），GSAP `textContent` + `snap` + `onUpdate` 拼接后缀，`start:'top 55%'` 触发。**新增统计项必须同时提供两个 data 属性**
- **技能条**（Skills）：`.skills__card-level-fill` 初始 `width:100%`，用 `scaleX: level/100`（内联 `transformOrigin:'left'`）填充；进度值来自组件顶部 `skills` 数组的 `level` 字段，**数组顺序与 DOM 渲染顺序一一对应**（回调按 index 取 `skills[i].level`）

### 5.4 视差背景
`App.tsx` 遍历所有 `.section` 通用做背景/内容 scrub 视差；`Decorations.tsx` 内霓虹光斑以 `document.body` 全程 scrub。各区块内的 `fromTo` 视差基于 `container.current`。任何区块的布局高度变化后需要刷新：App 已在挂载后调用 `ScrollTrigger.refresh()`；若动态改变内容高度，记得补调。

---

### 5.5 无障碍降级（prefers-reduced-motion）—— 新增动画必读
全站支持系统级「减少动态效果」：

- JS 侧：`src/utils/motion.ts` 导出常量 `REDUCED_MOTION`。所有入场 timeline / scrub 视差 /
  循环动画 / Canvas 数字雨在使用前先 `if (REDUCED_MOTION) return`（或按需静态兜底，
  如 Skills 直接把技能条 `gsap.set` 到最终比例、Hero 跳过开场）。统计数字静态值已在 JSX 中。
- CSS 侧：`_base.scss` 末尾媒体查询把纯 CSS 动画（glitch / blink / heartbeat / 滚动线…）
  收敛为静态；`_hero.scss` 末尾有配套覆盖——把 Hero 的「CSS 初始隐藏态」元素强制显示
  （跳过 JS 揭示时内容不能消失）。**给 Hero 新增参与开场动画的元素时，必须同步更新该覆盖。**

> 开发/调试小贴士：Chrome DevTools Rendering 面板勾选 `Emulate CSS prefers-reduced-motion: reduce`
> 即可快速验证降级效果。

## 6. 组件与内容数据（改文案/作品/技能位置）

| 内容 | 位置 | 说明 |
| --- | --- | --- |
| 页面标题/描述/图标 | `index.html` + `public/favicon.svg` | `<title>`、SEO/OG meta、canonical（当前指向 `https://logic-beep.github.io/`） |
| Hero 文案/终端 | `Hero.tsx` | 问候语、两行标题、副标题、meta、终端对话文本 |
| About 文案/统计 | `About.tsx` | 中文简介段落、`.about__text-stats-item` 的 `data-num/data-suffix` |
| 技能卡片 | `Skills.tsx` 顶部 `skills` 数组 | title/desc/level/levelLabel/icon(SVG JSX)；新增条目会自动进网格 |
| 项目列表 | `Works.tsx` 顶部 `works` 数组 | num/badge/title/desc/tags/previewClass/hud/**url(可选)** |
| 联系邮箱/社交链接 | `Contact.tsx` | `mailto:` 邮箱；`socials` 数组（label/Icon/**href(可选)**） |
| HUD 角标文本 | `Decorations.tsx` 的 `HUDCorners` | 如 `SYS.INIT`、`PING: 12ms`、右下角 `#hud-time` 每秒由 JS 更新 |

- **`Works` 的 `previewClass`**（`works__visual-preview--1/2/3`）是纯 CSS 渐变/图案缩略图（无图片资源）。新增作品：给数组加对象，并到 `_works.scss` 增加对应的 `--N` 样式类，否则缩略图无样式
- **Works 的 `url` 与 Contact `socials` 的 `href` 均为可选字段**：缺省时渲染 `--disabled` 禁用态（弱化、不可点击），**不要再写 `href="#"`**（点击会跳回页面顶部）。GitHub 社交链接已填 `https://github.com/logic-beep`；其余链接填入真实地址后自动变为可点击外链
- 描述文案可中英混排；`hl` 包裹关键词可获得高亮发光
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
5. 若需要区分配色/主题，优先追加变量或对区块加修饰类，避免污染全局类
6. `npm run build` 验证类型与产物；push 到 main 触发 CI + 自动部署

新增 **Decorations**（视觉装饰元素）同理：改 `Decorations.tsx` + `_decorations.scss`；容器是 `aria-hidden="true"` 的 fixed 层，不承载语义内容。

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
2. **无障碍动效偏好** → 已全站支持 `prefers-reduced-motion`（`_base.scss`/`_hero.scss` 媒体查询 + 各组件 `REDUCED_MOTION` 分支，见 5.5）
3. **SEO/OG meta** → 已补 description / OG / Twitter / canonical；`og:url` 与 `canonical` 目前写死 `https://logic-beep.github.io/`，更换域名时需同步修改
4. **占位链接去风险** → Works `url` / Contact `socials` 的 `href` 缺省渲染禁用态，不再有跳回顶部的 `#` 链接；GitHub 已按仓库远端填写
5. **README 缺省** → 已新建 `README.md`

### 剩余建议（非阻塞）
1. **占位内容替换**：邮箱 `hello@cyberdev.io`、作品描述/统计数字/简介仍为模板内容；接入真实资料后对应链接会自动激活（按第 6 节位置修改）
2. **无测试/静态检查**：目前只有 `tsc` strict 把关，CI 不跑 lint；如需可引入 ESLint/Prettier（需新增依赖与脚本，先讨论）
3. **功能扩展候选**：顶部导航、亮/暗主题、i18n、博客/时间线区块等（先讨论再动手，遵循第 7 节 SOP）

---

## 10. AI 辅助开发红线（务必遵守）

- ✅ 改前先 `read` 目标文件，遵循既有结构；改完跑 `npm run build` 自检（tsc strict + Vite 产物）
- ✅ 颜色/断点/字体走 `_variables.scss`，避免魔法值；新效果优先用 `_mixins.scss` 已有混入
- ✅ 动效选择器限制在 `useGSAP scope` 内；`data-text`/`data-num`/`data-suffix` 与对应 CSS/JS 必须成对出现
- ✅ 新增任何 JS 动效 / Canvas 循环必须处理 `REDUCED_MOTION` 降级（见 5.5）；给 Hero 新增「初始隐藏」元素时同步补 `_hero.scss` 的 reduce 覆盖，否则降级模式下内容不可见
- ✅ Works/Contact 占位链接一律用可选 `url`/`href` 字段 + `--disabled` 禁用态渲染，**禁止写 `href="#"`**
- ✅ 保持 StrictMode 兼容：effect 内资源（rAF/interval/监听器）必须有清理；GSAP 动画统一走 `useGSAP`（自动 revert）
- ❌ 不要改/提交 `dist/`（git-ignored、CI 生成）、`package-lock` 除非确需加依赖
- ❌ 不要擅自引入路由/状态管理/新大依赖；确有需要先在对话中提出
- ❌ 不要删除「CSS 初始隐藏态 ↔ GSAP to 揭示」的配对（见 5.2），会导致 Hero 开场失效或内容不可见
- ❌ 不要破坏装饰层语义：`Decorations` 固定全屏且 `pointer-events:none`，勿把交互内容放进去
- ❌ 中文字符串默认 UTF-8；文件内混排文案遵循既有「系统提示 + 中文正文」风格，别引入英文直译腔
