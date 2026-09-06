# CYBER.PORTFOLIO // Personal Homepage

赛博朋克 / 霓虹像素风的个人主页（单页 Portfolio）。
React 18 + TypeScript + Vite + SCSS，GSAP ScrollTrigger 驱动入场 / 视差动效，
Canvas 数字雨 + 霓虹光斑 + Glitch 故障字 + HUD 界面元素。

> 仓库：`logic-beep/logic-beep.github.io` · 在线站点：https://logic-beep.github.io/
> 给 AI / 协作者的完整开发约定请看 **[agents.md](./agents.md)**（务必先读）。

## 技术栈

| 类目 | 选型 |
| --- | --- |
| 框架 | React 18 + TypeScript 5.5（strict）+ Vite 5 |
| 样式 | SCSS（Dart Sass），设计令牌集中 `src/styles/_variables.scss` |
| 动效 | GSAP 3 + ScrollTrigger + `@gsap/react`（useGSAP） |
| 字体 | `@fontsource` 本地引入（Orbitron / Rajdhani / Space Mono / Press Start 2P / VT323） |
| 部署 | GitHub Actions → GitHub Pages（Node 22，`tsc -b` 类型检查 + `vite build`） |

## 本地开发

```bash
npm ci            # 安装依赖
npm run dev       # http://localhost:5173（自动开浏览器）
npm run build     # 类型检查 + 构建到 dist/（提交前自检用这条）
npm run preview   # 预览构建产物
```

## 目录速览

```
index.html                    # HTML 入口：SEO/OG meta、favicon、标题
public/favicon.svg            # 站点图标（霓虹 L 风格）
src/
  main.tsx                    # 入口：字体 → main.scss → <App/>
  App.tsx                     # 根组件：ScrollTrigger 注册、通用区块视差、区块组装
  utils/motion.ts             # prefers-reduced-motion 检测（无障碍降级开关）
  components/
    sections/                 # Hero / About / Skills / Works / Contact
    decorations/Decorations.tsx  # 数字雨 canvas、霓虹光斑、HUD 角标（固定全屏装饰层）
  styles/                     # main.scss 聚合入口 + 分区块 partial
```

## 内容维护（快速入口）

| 想改什么 | 去哪里 |
| --- | --- |
| 标题 / 简介 / 社交卡片信息 | `index.html`（meta/OG） |
| Hero 文案 / 终端文字 | `src/components/sections/Hero.tsx` |
| 关于文案 / 统计数字 | `src/components/sections/About.tsx` |
| 技能卡片 | `src/components/sections/Skills.tsx` 顶部 `skills` 数组 |
| 精选项目（含 `url` 链接） | `src/components/sections/Works.tsx` 顶部 `works` 数组 |
| 邮箱 / 社交链接 | `src/components/sections/Contact.tsx`（`socials` 数组，缺 href 显示禁用态） |
| 配色 / 字体 / 断点 | `src/styles/_variables.scss` |

> 注：当前页面中的邮箱、部分社交链接、作品数据等仍为模板占位内容，
> 替换真实资料时请参照 [agents.md](./agents.md) 第 6 节。

## 无障碍

已支持系统级 `prefers-reduced-motion`：开启「减少动态效果」时，入场 / 视差 /
数字雨 / Glitch 等动画全部静态化，Hero 内容通过 CSS 覆盖保持可见
（详见 `src/utils/motion.ts` 与 `_base.scss` / `_hero.scss` 的媒体查询）。
