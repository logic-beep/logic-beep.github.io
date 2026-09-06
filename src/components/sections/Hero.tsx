import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

const Hero = () => {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    // 减少动态效果：开场/视差全部跳过，内容由 _hero.scss 的
    // prefers-reduced-motion 覆盖强制显示为静态
    if (REDUCED_MOTION) return

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.to('.hero__greeting', {
      y: 0,
      opacity: 1,
      duration: 0.8,
    }, 0.2)

    tl.to('.hero__title-inner--1', {
      y: 0,
      duration: 1,
      ease: 'expo.out',
    }, 0.3)

    tl.to('.hero__title-inner--2', {
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
    }, 0.45)

    tl.to('.hero__subtitle', {
      y: 0,
      opacity: 1,
      duration: 0.9,
    }, 0.85)

    tl.to('.hero__meta', {
      y: 0,
      opacity: 1,
      duration: 0.9,
    }, 1.0)

    tl.to('.hero__terminal', {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'back.out(1.4)',
    }, 1.15)

    tl.to('.hero__scroll', {
      opacity: 1,
      duration: 0.6,
    }, 1.5)

    gsap.to('.hero__title', {
      yPercent: 10,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })

    gsap.to('.hero__greeting, .hero__subtitle, .hero__meta', {
      yPercent: 20,
      opacity: 0.2,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })

    gsap.to('.hero__terminal', {
      rotation: -3,
      yPercent: -15,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
  }, { scope: container })

  return (
    <section ref={container} className="section hero" id="hero">
      <div className="section-bg hero-bg" />
      <div className="section-content hero-content">
        <div>
          <p className="hero__greeting">Initializing System... // Hello, I am</p>

          <h1 className="hero__title">
            <span className="hero__title-line">
              <span
                className="hero__title-inner hero__title-inner--1 glitch-text"
                data-text="CYBER.DEV"
              >
                CYBER.DEV
              </span>
            </span>
            <span className="hero__title-line">
              <span className="hero__title-inner hero__title-inner--2">
                <span className="hero__title--accent glitch-text" data-text="//PIXEL_ARTIST">
                  //PIXEL_ARTIST
                </span>
              </span>
            </span>
          </h1>

          <p className="hero__subtitle">
            <span className="hl">[SYS]</span> Crafting immersive digital experiences
            with <span className="hl">neon-lit code</span> & pixel-perfect design.
            <br />
            <span className="hl">[0x00]</span> Turning caffeine into clean commits since 2021.
          </p>

          <div className="hero__meta">
            <div className="hero__meta-item">
              <span>Location</span>
              <span>SHANGHAI // CN</span>
            </div>
            <div className="hero__meta-item">
              <span>Stack</span>
              <span>REACT · TS · WEBGL</span>
            </div>
            <div className="hero__meta-item">
              <span>Uptime</span>
              <span>99.97%</span>
            </div>
          </div>
        </div>

        <aside className="hero__terminal" aria-hidden="true">
          <div className="hero__terminal-bar">
            <span /><span /><span />
          </div>
          <div>
            <span className="prompt">$</span> <span className="cmd">whoami</span>
          </div>
          <div className="ok">  → cyber_dev_2077</div>
          <div>
            <span className="prompt">$</span> <span className="cmd">status --check</span>
          </div>
          <div className="ok">  ✓ GPU: RTX mode</div>
          <div className="ok">  ✓ Coffee: 82%</div>
          <div className="dim">  ⓘ Ready for collaboration...</div>
          <div>
            <span className="prompt">$</span> <span className="cmd">_</span>
            <span style={{ opacity: 1, display: 'inline-block', animation: 'labelBlink 1s steps(2) infinite' }}>▍</span>
          </div>
        </aside>

        <div className="hero__scroll">
          <span>Scroll :: Continue</span>
          <div className="hero__scroll-line" />
          <div className="hero__scroll-arrow" />
        </div>
      </div>
    </section>
  )
}

export default Hero
