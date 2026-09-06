import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

const HUDCorners = () => (
  <>
    <div className="decorations__hud decorations__hud--tl">
      <span>SYS.INIT</span>
      <span>PORTFOLIO_v2.077</span>
      <span>STATUS: ONLINE</span>
    </div>
    <div className="decorations__hud decorations__hud--tr">
      <span>NET.CONN</span>
      <span>PING: 12ms</span>
      <span>NODE: CN-SH-01</span>
    </div>
    <div className="decorations__hud decorations__hud--bl">
      <span>CPU: 04%</span>
      <span>MEM: 128MB</span>
      <span>GPU: IDLE</span>
    </div>
    <div className="decorations__hud decorations__hud--br">
      <span id="hud-time">TIME: 00:00:00</span>
      <span>FRAME: 60Hz</span>
      <span>RENDER: WEBGL</span>
    </div>
  </>
)

const Decorations = () => {
  const container = useRef<HTMLDivElement>(null)
  const rainCanvas = useRef<HTMLCanvasElement>(null)

  useGSAP(() => {
    // 减少动态效果：霓虹光斑 / 像素粒子 / 滚动视差全部跳过
    if (REDUCED_MOTION) return

    const neons = gsap.utils.toArray<HTMLElement>('.decorations__neon')
    neons.forEach((el, i) => {
      gsap.to(el, {
        x: () => gsap.utils.random(-50, 50),
        y: () => gsap.utils.random(-60, 60),
        scale: () => gsap.utils.random(0.95, 1.15),
        duration: 8 + i * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })

    const pixels = gsap.utils.toArray<HTMLElement>('.decorations__pixel')
    pixels.forEach((el, i) => {
      gsap.set(el, {
        opacity: () => gsap.utils.random(0.3, 0.9),
      })
      gsap.to(el, {
        y: `random(-80, 80, 5)`,
        x: `random(-40, 40, 5)`,
        rotation: () => gsap.utils.random(0, 90),
        opacity: () => gsap.utils.random(0.1, 1),
        duration: () => gsap.utils.random(3, 6),
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.4,
      })
    })

    gsap.to('.decorations__neon--1', {
      yPercent: -25,
      xPercent: -10,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
    gsap.to('.decorations__neon--2', {
      yPercent: -18,
      xPercent: 8,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
    gsap.to('.decorations__neon--3', {
      yPercent: 20,
      xPercent: -12,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
  }, { scope: container })

  useEffect(() => {
    // HUD 时钟始终运行（无动态效果，仅文本每秒刷新）
    const updateTime = () => {
      const el = document.getElementById('hud-time')
      if (el) {
        const now = new Date()
        const t = now.toTimeString().split(' ')[0]
        el.textContent = `TIME: ${t}`
      }
    }
    const timeInt = setInterval(updateTime, 1000)
    updateTime()

    // 减少动态效果：不启动数字雨 Canvas 渲染循环
    if (REDUCED_MOTION) {
      return () => clearInterval(timeInt)
    }

    const canvas = rainCanvas.current
    if (!canvas) {
      return () => clearInterval(timeInt)
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return () => clearInterval(timeInt)
    }

    let animationId: number
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789{}[]<>|/\\#@$%&*'.split('')
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 1, 15, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px Space Mono, monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const gradient = (drops[i] * fontSize) / canvas.height
        const r = Math.floor(0 + gradient * 100)
        const g = Math.floor(240 - gradient * 180)
        const b = Math.floor(255 - gradient * 100)
        ctx.fillStyle = `rgba(${r},${g},${b},${0.3 + gradient * 0.7})`
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      clearInterval(timeInt)
    }
  }, [])

  return (
    <div ref={container} className="decorations" aria-hidden="true">
       <div className="decorations__circuits" />

      <div className="decorations__neon decorations__neon--1" />
      <div className="decorations__neon decorations__neon--2" />
      <div className="decorations__neon decorations__neon--3" />
      <div className="decorations__neon decorations__neon--4" />

      <canvas ref={rainCanvas} className="decorations__rain" />

      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`decorations__pixel decorations__pixel--${i + 1}`} />
      ))}

      <HUDCorners />
    </div>
  )
}

export default Decorations
