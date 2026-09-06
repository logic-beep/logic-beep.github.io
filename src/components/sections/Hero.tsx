import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

const Hero = () => {
  const container = useRef<HTMLElement>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({
    t1: true,
    t2: true,
    t3: false,
    t4: false,
  })

  const toggleCheck = (key: string, el: HTMLElement | null) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
    if (el && !checked[key]) {
      el.classList.add('animate-check')
      setTimeout(() => el.classList.remove('animate-check'), 350)
    }
  }

  useGSAP(() => {
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

    tl.to('.hero__tasklist', {
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

    gsap.to('.hero__tasklist', {
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
          <p className="hero__greeting">
            <span className="hero__greeting-prefix">// boot.system()</span>
            <br />
            <span className="hero__greeting-text">Loading profile... // Hello, I am</span>
          </p>

          <h1 className="hero__title">
            <span className="hero__title-line">
              <span className="hero__title-inner hero__title-inner--1">
                GEEK.DEV
              </span>
            </span>
            <span className="hero__title-line">
              <span className="hero__title-inner hero__title-inner--2">
                <span className="hero__title--accent">// CODE_ARTISAN</span>
              </span>
            </span>
          </h1>

          <p className="hero__subtitle">
            <span className="hl">[TASK_00]</span> Building elegant solutions
            with <span className="hl">clean code</span> & pixel-precise design.
            <br />
            <span className="hl">[LOG_42]</span> Solving puzzles, shipping features, learning every day.
          </p>

          <div className="hero__meta">
            <div className="hero__meta-item">
              <span className="hero__meta-key">LOCATION</span>
              <span className="hero__meta-value">SHANGHAI / CN</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-key">STACK</span>
              <span className="hero__meta-value">REACT · TS · NODE</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-key">STATUS</span>
              <span className="hero__meta-value hero__meta-value--ok">● AVAILABLE</span>
            </div>
          </div>
        </div>

        <aside className="hero__tasklist" aria-hidden="true">
          <div className="hero__tasklist-header">
            <span className="hero__tasklist-dot hero__tasklist-dot--r" />
            <span className="hero__tasklist-dot hero__tasklist-dot--y" />
            <span className="hero__tasklist-dot hero__tasklist-dot--g" />
            <span className="hero__tasklist-title">TASKLIST.txt</span>
            <span className="hero__tasklist-code">0x00</span>
          </div>

          <div
            className={`geek-checkbox hero__tasklist-check ${checked.t1 ? 'is-checked' : ''}`}
            onClick={(e) => toggleCheck('t1', e.currentTarget)}
            id="hc-1"
          />
          <label htmlFor="hc-1" className="hero__tasklist-item hero__tasklist-item--done">
            Bootstrap React + TS environment
          </label>

          <div
            className={`geek-checkbox hero__tasklist-check ${checked.t2 ? 'is-checked' : ''}`}
            onClick={(e) => toggleCheck('t2', e.currentTarget)}
            id="hc-2"
          />
          <label htmlFor="hc-2" className="hero__tasklist-item hero__tasklist-item--done">
            Design system with tokens
          </label>

          <div
            className={`geek-checkbox hero__tasklist-check ${checked.t3 ? 'is-checked' : ''}`}
            onClick={(e) => toggleCheck('t3', e.currentTarget)}
            id="hc-3"
          />
          <label htmlFor="hc-3" className={`hero__tasklist-item ${checked.t3 ? 'hero__tasklist-item--done' : ''}`}>
            Ship production build v2.1
          </label>

          <div
            className={`geek-checkbox hero__tasklist-check ${checked.t4 ? 'is-checked' : ''}`}
            onClick={(e) => toggleCheck('t4', e.currentTarget)}
            id="hc-4"
          />
          <label htmlFor="hc-4" className={`hero__tasklist-item ${checked.t4 ? 'hero__tasklist-item--done' : ''}`}>
            Next challenge: You + Me?
          </label>

          <div className="hero__tasklist-footer">
            <span className="prompt">$</span>
            <span className="cmd"> scroll</span>
            <span style={{ display: 'inline-block', animation: 'labelBlink 1s steps(2) infinite' }}>▍</span>
          </div>
        </aside>

        <div className="hero__scroll">
          <span>CONTINUE :: SCROLL</span>
          <div className="hero__scroll-line" />
          <div className="hero__scroll-arrow" />
        </div>
      </div>
    </section>
  )
}

export default Hero
