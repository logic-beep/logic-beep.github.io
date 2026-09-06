import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

interface Work {
  num: string
  badge: string
  title: string
  desc: string
  tags: string[]
  previewClass: string
  hud: string
  /** 可选：项目真实链接。缺省时 "View Project" 渲染为禁用态占位 */
  url?: string
}

const works: Work[] = [
  {
    num: '01',
    badge: 'FEATURED',
    title: 'BLUEPRINT // 极客设计系统',
    desc: '面向开发者社区的完整设计系统：包含 120+ 组件、浅/深双主题、像素边框与虚线规范，以及从 Figma Tokens → React SCSS 变量的自动化同步流水线。',
    tags: ['DESIGN_SYSTEM', 'REACT', 'FIGMA'],
    previewClass: 'works__visual-preview--1',
    hud: 'BUILD_OK • v2.1.0',
  },
  {
    num: '02',
    badge: 'WEB_APP',
    title: 'NODE.MAP // 3D 节点可视化',
    desc: '面向网络运维的实时拓扑控制台：基于 Three.js 构建的三维节点图 + D3 力导向图层叠加，支持万级节点流畅渲染，蓝色渐变映射健康度指标。',
    tags: ['THREE.JS', 'D3.JS', 'WEBGL'],
    previewClass: 'works__visual-preview--2',
    hud: '60FPS • NODES:10K',
  },
  {
    num: '03',
    badge: 'CREATIVE',
    title: 'PIXEL.QUEST // 独立作品集',
    desc: '为独立游戏开发者打造的沉浸式作品站：GSAP ScrollTrigger 实现章节 Pin 切换，配合 WebGL 自定义像素着色器与 8-bit 音频波形可视化。',
    tags: ['GSAP', 'SHADERS', 'NEXT.JS'],
    previewClass: 'works__visual-preview--3',
    hud: 'AOTW_★★★★★',
  },
]

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Works = () => {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    // 减少动态效果：跳过入场与视差，内容保持静态可见
    if (REDUCED_MOTION) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      defaults: { ease: 'power3.out' },
    })

    tl.from('.section-label--works, .works h2, .works > .section-content > .works-content-heading p', {
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
    }, 0)

    gsap.utils.toArray<HTMLElement>('.works__item').forEach((item, i) => {
      const visual = item.querySelector('.works__visual') as HTMLElement
      const text = item.querySelector('.works__text') as HTMLElement
      const num = item.querySelector('.works__item-num') as HTMLElement

      const itemTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      })

      itemTl.from(num, {
        opacity: 0,
        scale: 0.4,
        x: 50,
        rotation: 12,
        duration: 0.9,
      }, 0)

      itemTl.from(visual, {
        x: i % 2 === 0 ? -80 : 80,
        opacity: 0,
        scale: 0.92,
        duration: 1,
      }, 0.1)

      itemTl.from(text, {
        x: i % 2 === 0 ? 80 : -80,
        opacity: 0,
        duration: 1,
      }, 0.2)

      itemTl.from(text.querySelectorAll('span, h3, p, a'), {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
      }, 0.55)

      gsap.to(visual, {
        yPercent: -6,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(num, {
        xPercent: 15,
        rotation: 4,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })
  }, { scope: container })

  return (
    <section ref={container} className="section works" id="works">
      <div className="section-bg works-bg" />
      <div className="section-content works-content">
        <div className="works-content-heading">
          <span className="section-label section-label--works">Portfolio // SELECTED_WORKS</span>
          <h2>
            精选项目
            <br />
            <span className="hl">//BLUEPRINT.ARCHIVE</span>
          </h2>
          <p>
            // 从 0x00 至 0xFF — 每一次上线都是一次构建通过
            <br />
            Log: 48 commits · 29 releases · 1 critical bug fixed in 13 minutes.
          </p>
        </div>

        <div className="works__list">
          {works.map((work, i) => (
            <article key={i} className="works__item">
              <span className="works__item-num">{work.num}</span>

              <div className="works__visual">
                <div className={`works__visual-preview ${work.previewClass}`} />
                <span className="works__visual-badge">{work.badge}</span>
                <span className="works__visual-hud">{work.hud}</span>
              </div>

              <div className="works__text">
                <div className="works__text-tags">
                  {work.tags.map((tag, j) => (
                    <span key={j}>{tag}</span>
                  ))}
                </div>
                <h3>{work.title}</h3>
                <p>{work.desc}</p>
                {work.url ? (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="works__text-link"
                    aria-label={`View Project: ${work.title}`}
                  >
                    <span>View Project</span>
                    <ArrowIcon />
                  </a>
                ) : (
                  <span
                    className="works__text-link works__text-link--disabled"
                    aria-disabled="true"
                    title="链接待补充：请在 Works.tsx 的 works 数组中为该作品填写 url 字段"
                  >
                    <span>View Project</span>
                    <ArrowIcon />
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Works
