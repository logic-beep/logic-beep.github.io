import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

const PortraitIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="8" width="36" height="44" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    <circle cx="32" cy="26" r="9" fill="currentColor" opacity="0.9" />
    <path d="M18 52C18 44.8 24.3 39 32 39C39.7 39 46 44.8 46 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    <rect x="20" y="4" width="24" height="3" fill="currentColor" opacity="0.3" />
    <rect x="44" y="30" width="6" height="2" fill="currentColor" opacity="0.5" />
    <rect x="14" y="30" width="6" height="2" fill="currentColor" opacity="0.5" />
  </svg>
)

const About = () => {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    // 减少动态效果：跳过入场/视差/扫描动画；
    // 统计数字在 JSX 中已是最终值（如 48+），保持静态
    if (REDUCED_MOTION) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      defaults: { ease: 'power3.out' },
    })

    tl.from('.about__visual', {
      x: -80,
      opacity: 0,
      scale: 0.88,
      duration: 1.2,
    }, 0)

    tl.from('.about__visual-frame', {
      rotation: 0,
      scale: 0.7,
      opacity: 0,
      duration: 1.4,
      stagger: 0.12,
    }, 0.15)

    tl.from('.about__visual-portrait svg', {
      scale: 0,
      opacity: 0,
      rotation: -30,
      duration: 0.9,
      ease: 'back.out(1.6)',
    }, 0.6)

    tl.from('.about__visual-badge', {
      scale: 0,
      opacity: 0,
      x: 40,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, 0.8)

    tl.from('.section-label--about, .about__text-heading h2, .about__text-heading p', {
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
    }, 0.1)

    tl.from('.about__text-body p', {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
    }, 0.45)

    tl.from('.about__text-stats-item', {
      y: 40,
      opacity: 0,
      scale: 0.9,
      duration: 0.7,
      stagger: 0.12,
    }, 0.75)

    const stats = document.querySelectorAll<HTMLElement>('.about__text-stats-item .num')
    stats.forEach((el) => {
      const target = parseInt(el.dataset.num || '0', 10)
      const suffix = el.dataset.suffix || ''
      gsap.to(el, {
        textContent: target,
        duration: 1.6,
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: container.current,
          start: 'top 55%',
        },
        onUpdate: () => {
          const v = Math.round(parseInt(el.textContent || '0', 10))
          el.textContent = v + suffix
        },
      })
    })

    gsap.fromTo(
      '.about__visual-frame',
      { rotation: -8 },
      {
        rotation: 5,
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    )

    gsap.to('.about__visual-portrait-scan', {
      yPercent: 120,
      duration: 3,
      ease: 'none',
      repeat: -1,
    })
  }, { scope: container })

  return (
    <section ref={container} className="section about" id="about">
      <div className="section-bg about-bg" />
      <div className="section-content about-content">
        <div className="about__visual">
          <div className="about__visual-frame about__visual-frame2" />
          <div className="about__visual-frame" />
          <div className="about__visual-portrait">
            <PortraitIcon />
            <div className="about__visual-portrait-scan" />
          </div>
          <div className="about__visual-badge">
            <span data-num="5" data-suffix="+">5+</span>
            <span>YEARS_ONLINE</span>
          </div>
        </div>

        <div className="about__text">
          <div className="about__text-heading">
            <span className="section-label section-label--about">About // USER_PROFILE</span>
            <h2>
              在<span className="hl glitch-text" data-text="霓虹像素">霓虹像素</span>中，
              <br />
              编码未来。
            </h2>
            <p>Frontend Engineer · Creative Coder · Visual Designer</p>
          </div>

          <div className="about__text-body">
            <p>
              01001000 01100101 01101100 01101100 01101111 —— 我是一名游荡在赛博空间的前端创作者，
              用 React 与 WebGL 构建霓虹质感的交互世界。
              从 8-bit 像素到 4K 渲染，每一行代码都是一场仪式。
            </p>
            <p>
              迷恋霓虹色彩下的故障美学（Glitch Art），
              追求流畅的 60fps 丝滑动效与干净的架构设计。
              白天写 TS，夜晚调 Shader。咖啡 + 合成波 = 我的开发环境。
            </p>
          </div>

          <div className="about__text-stats">
            <div className="about__text-stats-item">
              <span className="num" data-num="48" data-suffix="+">48+</span>
              <span className="label">PROJECTS_DEPLOYED</span>
            </div>
            <div className="about__text-stats-item">
              <span className="num" data-num="32" data-suffix="">32</span>
              <span className="label">CLIENTS_SERVED</span>
            </div>
            <div className="about__text-stats-item">
              <span className="num" data-num="15" data-suffix="">15</span>
              <span className="label">AWARDS_EARNED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
