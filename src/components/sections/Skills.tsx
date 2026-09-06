import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

interface Skill {
  title: string
  desc: string
  level: number
  levelLabel: string
  icon: JSX.Element
}

const skills: Skill[] = [
  {
    title: 'React / Next.js',
    desc: 'Components · SSR · RSC · State',
    level: 92,
    levelLabel: 'MASTER',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    title: 'TypeScript',
    desc: 'Generics · Types · Strict Mode',
    level: 88,
    levelLabel: 'ADVANCED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="monospace">TS</text>
      </svg>
    ),
  },
  {
    title: 'GSAP Animation',
    desc: 'Timeline · Scroll · Morph',
    level: 90,
    levelLabel: 'MASTER',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12C3 7 7 3 12 3C14.2 3 16.2 3.8 17.7 5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="19" cy="12" r="3" fill="currentColor" />
        <path d="M12 21C9.5 21 7.2 20 5.6 18.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="10" width="4" height="4" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: 'Three.js / WebGL',
    desc: '3D · Shaders · Post FX',
    level: 78,
    levelLabel: 'ADVANCED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 2V12" stroke="currentColor" strokeWidth="2" />
        <path d="M4 7L12 12L20 7" stroke="currentColor" strokeWidth="2" />
        <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" opacity="0.6" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'UI / UX Design',
    desc: 'Figma · Design Tokens · System',
    level: 85,
    levelLabel: 'ADVANCED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 12.87 8.13 16 12 16C15.87 16 19 12.87 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 22H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="15" cy="9" r="1" fill="currentColor" />
        <path d="M9.5 11.5C10 12 11 12.5 12 12.5C13 12.5 14 12 14.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Sass / CSS',
    desc: 'Layouts · Motion · Themes',
    level: 93,
    levelLabel: 'MASTER',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M6 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="16" y="14" width="3" height="3" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    title: 'Node.js',
    desc: 'API · Edge · Build Pipeline',
    level: 80,
    levelLabel: 'ADVANCED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 9.5L17 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 9.5L7 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: 'Vite / Build',
    desc: 'Perf · Bundler · Deploy',
    level: 86,
    levelLabel: 'ADVANCED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
        <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
]

const Skills = () => {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (REDUCED_MOTION) {
      gsap.utils.toArray<HTMLElement>('.skills__card-level-fill').forEach((el, i) => {
        gsap.set(el, { scaleX: skills[i].level / 100 })
      })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      defaults: { ease: 'power3.out' },
    })

    tl.from('.section-label--skills, .skills h2, .skills .subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
    }, 0)

    tl.from('.skills__card', {
      y: 60,
      opacity: 0,
      scale: 0.88,
      duration: 0.9,
      stagger: {
        amount: 0.65,
        from: 'start',
      },
    }, 0.25)

    const fills = gsap.utils.toArray<HTMLElement>('.skills__card-level-fill')
    fills.forEach((el, i) => {
      const target = skills[i].level
      gsap.to(el, {
        scaleX: target / 100,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.6 + i * 0.08,
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    gsap.utils.toArray<HTMLElement>('.skills__card').forEach((card, i) => {
      gsap.to(card, {
        yPercent: i % 2 === 0 ? -4 : 4,
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })
  }, { scope: container })

  return (
    <section ref={container} className="section skills" id="skills">
      <div className="section-bg skills-bg" />
      <div className="section-content skills-content">
        <div className="skills-content-heading">
          <span className="section-label section-label--skills">Skills // TOOLBOX_2.1</span>
          <h2>
            <span className="hl">SKILL_MATRIX</span>
            <br />技术矩阵
          </h2>
          <p className="subtitle">
            // 经过 5+ 年实战磨砺 · 每一项技能都在真实项目中验证
            <br />
            Level 0x00 → 0xFF — 持续升级，点亮新技能。
          </p>
        </div>

        <div className="skills__grid">
          {skills.map((skill, i) => (
            <div key={i} className="skills__card">
              <div className="skills__card-corner-tl" aria-hidden="true" />
              <div className="skills__card-corner-br" aria-hidden="true" />
              <div className="skills__card-icon">{skill.icon}</div>
              <h4 className="skills__card-title">{skill.title}</h4>
              <p className="skills__card-desc">{skill.desc}</p>
              <div className="skills__card-level">
                <div className="skills__card-level-label">
                  <span>{skill.levelLabel}</span>
                  <span className="skills__card-level-num">
                    <span className="geek-checkbox geek-checkbox--mini is-checked" aria-hidden="true" />
                    {skill.level}%
                  </span>
                </div>
                <div className="skills__card-level-bar">
                  <div className="skills__card-level-fill" style={{ width: '100%', transformOrigin: 'left' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
