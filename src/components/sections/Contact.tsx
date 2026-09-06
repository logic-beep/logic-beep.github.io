import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { REDUCED_MOTION } from '../../utils/motion'

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H14L8.5 9.5L3.5 2H0L6.5 11L0 22H4L9 14.5L14.5 22H22L15 13L21 2H18ZM16 20L3.5 4H6.5L19 20H16Z" fill="currentColor" />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.168 8.839 21.489C9.339 21.582 9.521 21.272 9.521 21C9.521 20.76 9.512 20.101 9.507 19.267C6.726 19.867 6.135 17.96 6.135 17.96C5.68 16.805 5.028 16.496 5.028 16.496C4.12 15.878 5.095 15.89 5.095 15.89C6.09 15.961 6.606 16.931 6.606 16.931C7.497 18.447 8.938 18.007 9.54 17.747C9.631 17.101 9.889 16.659 10.175 16.415C7.955 16.167 5.62 15.314 5.62 11.469C5.62 10.37 6.009 9.472 6.656 8.774C6.55 8.512 6.201 7.47 6.751 5.98C6.751 5.98 7.588 5.715 9.486 7.022C10.3 6.798 11.149 6.685 12.003 6.682C12.857 6.685 13.707 6.798 14.522 7.022C16.418 5.715 17.253 5.98 17.253 5.98C17.805 7.47 17.456 8.512 17.349 8.774C17.999 9.472 18.385 10.37 18.385 11.469C18.385 15.327 16.043 16.163 13.818 16.404C14.181 16.715 14.517 17.325 14.517 18.273C14.517 19.611 14.503 20.684 14.503 21C14.503 21.278 14.682 21.587 15.19 21.487C19.138 20.162 22 16.415 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" />
  </svg>
)

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M7.5 10V18M7.5 6.5V6.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7.5" cy="6.5" r="1" fill="currentColor" />
    <path d="M11.5 18V13C11.5 11.8954 12.3954 11 13.5 11C14.6046 11 15.5 11.8954 15.5 13V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="11" y="11" width="1" height="7" fill="currentColor" opacity="0.6" />
  </svg>
)

const DribbbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M8 3.5C11 7.5 13 13.5 14 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 10C8 9 16 9.5 21.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M21.5 7.5C17 10.5 10 14.5 4.5 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

interface SocialLink {
  label: string
  Icon: () => JSX.Element
  /** 可选：真实主页地址。缺省时渲染为禁用态占位（不再跳到页面顶部） */
  href?: string
}

const socials: SocialLink[] = [
  { label: 'Twitter', Icon: TwitterIcon },
  // GitHub 依据当前仓库远端（github.com/logic-beep）填写；其余待补充真实地址
  { label: 'GitHub', Icon: GithubIcon, href: 'https://github.com/logic-beep' },
  { label: 'LinkedIn', Icon: LinkedinIcon },
  { label: 'Dribbble', Icon: DribbbleIcon },
]

const Contact = () => {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    // 减少动态效果：跳过入场动画，内容保持静态可见
    if (REDUCED_MOTION) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      defaults: { ease: 'power3.out' },
    })

    tl.from('.contact__label', {
      y: 30,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
    }, 0)

    tl.from('.contact__title, .contact__title--accent', {
      y: 70,
      opacity: 0,
      duration: 1.1,
      stagger: 0.18,
    }, 0.1)

    tl.from('.contact__desc', {
      y: 45,
      opacity: 0,
      duration: 0.9,
    }, 0.4)

    tl.from('.contact__email', {
      y: 30,
      opacity: 0,
      scale: 0.92,
      duration: 0.85,
      ease: 'back.out(1.5)',
    }, 0.65)

    tl.from('.contact__social-link', {
      y: 40,
      opacity: 0,
      scale: 0.7,
      rotation: -15,
      duration: 0.65,
      stagger: 0.09,
      ease: 'back.out(1.6)',
    }, 0.85)

    tl.from('.contact__footer', {
      y: 25,
      opacity: 0,
      duration: 0.8,
    }, 1.15)
  }, { scope: container })

  return (
    <section ref={container} className="section contact" id="contact">
      <div className="section-bg contact-bg" />
      <div className="section-content contact-content">
        <span className="contact__label">Initiate Connection // UPLINK_READY</span>

        <h2 className="contact__title">
          有项目？
          <br />
          <span
            className="contact__title--accent glitch-text"
            data-text="//ESTABLISH_LINK"
          >
            //ESTABLISH_LINK
          </span>
        </h2>

        <p className="contact__desc">
          无论是 <span className="hl">freelance 合作</span>、全职 Offer，
          还是单纯想打个招呼聊技术 / 合成波 / 咖啡，
          我都在另一端等你。<br />
          <span className="hl">[SYS]</span> 平均响应时间：24 小时内。
        </p>

        <a href="mailto:hello@cyberdev.io" className="contact__email">
          <MailIcon />
          <span>hello@cyberdev.io</span>
        </a>

        <div className="contact__social">
          {socials.map(({ label, Icon, href }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
                aria-label={label}
              >
                <Icon />
              </a>
            ) : (
              <span
                key={label}
                className="contact__social-link contact__social-link--disabled"
                aria-disabled="true"
                title={`${label} 链接待补充：请在 Contact.tsx 的 socials 数组中填写 href`}
              >
                <Icon />
              </span>
            )
          )}
        </div>

        <footer className="contact__footer">
          <span className="contact__footer-left">
            © 2077 — Built with <span className="heart">❤</span> & neon electrons
          </span>
          <span className="contact__footer-right">
            // DESIGNED &amp; HACKED IN SHANGHAI
          </span>
        </footer>
      </div>
    </section>
  )
}

export default Contact
