import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

const HUDCorners = () => (
  <>
    <div className="decorations__hud decorations__hud--tl">
      <span>TASK.LIST</span>
      <span>QUEST_01_ACTIVE</span>
      <span>STATUS: ON_TRACK</span>
    </div>
    <div className="decorations__hud decorations__hud--tr">
      <span>SYS.LOG</span>
      <span>LINE: 0482</span>
      <span>NODE: MAIN_BRANCH</span>
    </div>
    <div className="decorations__hud decorations__hud--bl">
      <span>PROGRESS</span>
      <span>FILES: 128/256</span>
      <span>BUILD: PASSED</span>
    </div>
    <div className="decorations__hud decorations__hud--br">
      <span id="hud-time">CLOCK: 00:00:00</span>
      <span>DEPTH: LVL_05</span>
      <span>HINT: SCROLL_DOWN</span>
    </div>
  </>
)

const CircuitSVG = () => (
  <svg className="decorations__circuit-svg" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(0, 85, 255, 0)" />
        <stop offset="50%" stopColor="rgba(0, 85, 255, 0.4)" />
        <stop offset="100%" stopColor="rgba(0, 85, 255, 0)" />
      </linearGradient>
    </defs>
    <g stroke="url(#circuitGrad)" strokeWidth="1.5" fill="none">
      <path d="M50,80 L200,80 L200,160 L380,160" />
      <path d="M380,160 L380,300 L520,300 L520,220 L680,220" />
      <path d="M680,220 L680,100 L850,100" />
      <path d="M850,100 L850,260 L1000,260 L1000,140 L1150,140" />
      <path d="M80,400 L280,400 L280,520 L450,520" />
      <path d="M450,520 L450,640 L620,640 L620,560 L780,560" />
      <path d="M780,560 L780,680 L950,680 L950,600 L1120,600" />
      <path d="M120,720 L300,720 L300,720 L300,620 L500,620" />
    </g>
    <g fill="#0055FF" stroke="#1A1A2E" strokeWidth="1.5">
      <rect x="190" y="72" width="12" height="12" transform="rotate(45 196 78)" />
      <rect x="370" y="152" width="12" height="12" transform="rotate(45 376 158)" />
      <rect x="510" y="292" width="12" height="12" transform="rotate(45 516 298)" />
      <rect x="670" y="212" width="12" height="12" transform="rotate(45 676 218)" />
      <rect x="840" y="92" width="12" height="12" transform="rotate(45 846 98)" />
      <rect x="990" y="252" width="12" height="12" transform="rotate(45 996 258)" />
      <rect x="270" y="392" width="12" height="12" transform="rotate(45 276 398)" />
      <rect x="440" y="512" width="12" height="12" transform="rotate(45 446 518)" />
      <rect x="610" y="632" width="12" height="12" transform="rotate(45 616 638)" />
      <rect x="770" y="552" width="12" height="12" transform="rotate(45 776 558)" />
      <rect x="940" y="672" width="12" height="12" transform="rotate(45 946 678)" />
    </g>
    <g fill="none" stroke="#1A1A2E" strokeWidth="1" strokeDasharray="4 4" opacity="0.5">
      <rect x="40" y="60" width="180" height="100" />
      <rect x="350" y="130" width="220" height="190" />
      <rect x="820" y="70" width="220" height="210" />
      <rect x="60" y="380" width="440" height="170" />
      <rect x="750" y="540" width="380" height="170" />
    </g>
  </svg>
)

const Decorations = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (REDUCED_MOTION) return

    const dots = gsap.utils.toArray<HTMLElement>('.decorations__node')
    dots.forEach((el, i) => {
      gsap.set(el, { opacity: 0.4 + (i % 3) * 0.2 })
      gsap.to(el, {
        opacity: 1,
        scale: 1.3,
        duration: () => gsap.utils.random(1.2, 2.2),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.25,
      })
    })

    gsap.to('.decorations__circuit-svg', {
      yPercent: -8,
      xPercent: 3,
      rotation: 1,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    })
  }, { scope: container })

  useEffect(() => {
    const updateTime = () => {
      const el = document.getElementById('hud-time')
      if (el) {
        const now = new Date()
        const t = now.toTimeString().split(' ')[0]
        el.textContent = `CLOCK: ${t}`
      }
    }
    const timeInt = setInterval(updateTime, 1000)
    updateTime()
    return () => clearInterval(timeInt)
  }, [])

  return (
    <div ref={container} className="decorations" aria-hidden="true">
      <CircuitSVG />

      <div className="decorations__nodes">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`decorations__node decorations__node--${i + 1}`}
          />
        ))}
      </div>

      <div className="decorations__connections" />

      <HUDCorners />
    </div>
  )
}

export default Decorations
