import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface NavItem {
  id: string
  label: string
  code: string
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', code: '0x00' },
  { id: 'about', label: 'About', code: '0x01' },
  { id: 'skills', label: 'Skills', code: '0x02' },
  { id: 'works', label: 'Works', code: '0x03' },
  { id: 'contact', label: 'Contact', code: '0x04' },
]

const NAVBAR_HEIGHT = 72
const SCROLL_LOCK_MS = 650

const NavBar = () => {
  const [activeId, setActiveId] = useState('hero')
  const container = useRef<HTMLElement>(null)
  const scrollLockUntil = useRef(0)

  useGSAP(() => {
    gsap.fromTo('.navbar__tab',
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.5)',
        delay: 0.2,
        clearProps: 'transform,opacity',
      }
    )

    gsap.fromTo('.navbar__logo',
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    )

    gsap.fromTo('.navbar__checkboxes',
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
        clearProps: 'transform,opacity',
      }
    )
  }, { scope: container })

  useEffect(() => {
    const handleScroll = () => {
      if (Date.now() < scrollLockUntil.current) return
      const scrollPos = window.scrollY + 120
      for (const item of navItems) {
        const el = document.getElementById(item.id)
        if (el) {
          const top = el.offsetTop
          const bottom = top + el.offsetHeight
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveId(prev => (prev === item.id ? prev : item.id))
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkbox = document.querySelector(`.navbar-cb-${activeId}`)
    if (checkbox) {
      checkbox.classList.add('animate-check')
      const t = setTimeout(() => checkbox.classList.remove('animate-check'), 350)
      return () => clearTimeout(t)
    }
  }, [activeId])

  const handleNavClick = (id: string) => {
    scrollLockUntil.current = Date.now() + SCROLL_LOCK_MS
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.offsetTop - NAVBAR_HEIGHT,
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav ref={container} className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">
        <div className="navbar__logo">
          <span className="navbar__logo-bracket">[</span>
          <span className="navbar__logo-text">GEEK.DEV</span>
          <span className="navbar__logo-bracket">]</span>
          <span className="navbar__logo-version">/ v2.1</span>
        </div>

        <div className="navbar__tabs" role="tablist">
          {navItems.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activeId === item.id}
              aria-controls={`panel-${item.id}`}
              className={`navbar__tab ${activeId === item.id ? 'is-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="navbar__tab-code">{item.code}</span>
              <span className="navbar__tab-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar__checkboxes" aria-hidden="true">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`geek-checkbox navbar-cb navbar-cb-${item.id} ${activeId === item.id ? 'is-checked' : ''}`}
              title={item.label}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
          <div className="navbar__circuit-dot" />
          <div className="navbar__circuit-line" />
        </div>
      </div>

      <div className="navbar__bottom-line" aria-hidden="true">
        <div className="navbar__bottom-line-fill" />
      </div>
    </nav>
  )
}

export default NavBar
