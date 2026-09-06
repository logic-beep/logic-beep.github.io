import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from './utils/motion'
import NavBar from './components/navigation/NavBar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Works from './components/sections/Works'
import Contact from './components/sections/Contact'
import Decorations from './components/decorations/Decorations'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (REDUCED_MOTION) return

    gsap.utils.toArray<HTMLElement>('.section').forEach((section) => {
      const bg = section.querySelector('.section-bg') as HTMLElement | null
      const content = section.querySelector('.section-content') as HTMLElement | null

      if (bg) {
        gsap.fromTo(
          bg,
          { yPercent: -20 },
          {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      if (content) {
        gsap.fromTo(
          content,
          { yPercent: 5, opacity: 0.6 },
          {
            yPercent: -5,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true,
            },
          }
        )
      }
    })
  }, { scope: container })

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  return (
    <div ref={container} className="app">
      <NavBar />
      <Decorations />
      <main className="main-content">
        <Hero />
        <About />
        <Skills />
        <Works />
        <Contact />
      </main>
    </div>
  )
}

export default App
