import { useState, useEffect, useRef } from 'react'

// --- Intersection Observer hook ---
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// --- Carousel ---
function Carousel({ slides }: { slides: string[] }) {
  const [idx, setIdx] = useState(0)
  const touchStart = useRef(0)

  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length)
  const next = () => setIdx(i => (i + 1) % slides.length)

  return (
    <div className="relative w-full select-none">
      <div
        className="overflow-hidden rounded-lg"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={e => { touchStart.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStart.current
          if (dx > 50) prev()
          else if (dx < -50) next()
        }}
      >
        <div
          className="flex transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={i} className="min-w-full flex items-center justify-center" style={{ background: '#fff' }}>
              <img src={src} alt={`Slide ${i + 1}`} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '520px', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button className="carousel-btn" onClick={prev} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === idx ? 'var(--red)' : 'rgba(255,255,255,0.3)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="carousel-btn" onClick={next} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}

// --- DashlinkLogo SVG recreation ---
function DashlinkLogo({ dark = false }: { dark?: boolean }) {
  const dashColor = dark ? '#0d1b3e' : '#ffffff'
  const linkColor = '#e0141e'
  const dotColor = '#e0141e'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* D icon */}
      <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
        <path d="M20 10 C20 10 50 10 60 30 C70 50 60 70 40 70 L20 70 Z" stroke={dashColor} strokeWidth="5" fill="none" opacity="0.5"/>
        <path d="M20 20 C20 20 48 20 56 36 C64 52 56 60 40 60 L20 60 Z" stroke={dashColor} strokeWidth="4" fill="none" opacity="0.3"/>
        <circle cx="26" cy="40" r="6" fill={dotColor}/>
        <line x1="32" y1="40" x2="48" y2="28" stroke={dotColor} strokeWidth="1.5" opacity="0.6"/>
        <line x1="32" y1="40" x2="48" y2="40" stroke={dotColor} strokeWidth="1.5" opacity="0.4"/>
      </svg>
      {/* DASH LINK text */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
        <span style={{ color: dashColor, opacity: 0.6 }}>DASH</span>
        <span style={{ color: linkColor }}>LINK</span>
      </div>
    </div>
  )
}

// --- Navigation ---
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('opening')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = ['opening', 'vision', 'website', 'autos', 'systems', 'strategy', 'ecosystem', 'services', 'nextstep']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { id: 'vision', label: 'Vision' },
    { id: 'website', label: 'Website' },
    { id: 'autos', label: 'Autos' },
    { id: 'systems', label: 'Systems' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'services', label: 'Services' },
  ]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: '0 24px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled ? 'rgba(13,27,62,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
    }}>
      <button onClick={() => scrollTo('opening')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <img src="/assets/dashlink-logo-white.png" alt="Dashlink" style={{ height: '36px', objectFit: 'contain', display: 'block' }} />
      </button>
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`nav-link ${activeSection === id ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}

// --- Section 1: Opening ---
function Opening() {
  return (
    <section id="opening" style={{
      minHeight: '100vh',
      background: 'var(--navy)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '100px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background subtle texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(224,20,30,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Top-left corner accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '120px', height: '120px', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 16, left: -20, width: '100px', height: '4px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: 28, left: -20, width: '80px', height: '2px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.4 }} />
      </div>
      {/* Bottom-right corner accent */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '120px', height: '120px', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 16, right: -20, width: '100px', height: '4px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: 28, right: -20, width: '80px', height: '2px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.4 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', animation: 'fadeUp 0.9s ease forwards' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <img src="/assets/dashlink-logo-white.png" alt="Dashlink" style={{ height: '64px', objectFit: 'contain' }} />
        </div>

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--red)',
          marginBottom: '24px',
        }}>
          Digital Presence Proposal
        </p>

        {/* Main headline */}
        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
          lineHeight: 1.1,
          color: 'white',
          marginBottom: '24px',
          letterSpacing: '-0.02em',
        }}>
          Building a Stronger<br />Digital Dashlink.
        </h1>

        {/* Supporting */}
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          marginBottom: '40px',
          maxWidth: '540px',
          margin: '0 auto 40px',
        }}>
          A connected digital experience for Dashlink Integrated Autos<br />and Dashlink Integrated Systems.
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '52px' }}>
          {['Website', 'Social Media', 'Content', 'Digital Presence'].map(t => (
            <span key={t} style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '6px 14px',
              borderRadius: '3px',
            }}>{t}</span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button
            className="btn-primary"
            onClick={() => document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore the Proposal ↓
          </button>
          <a
            href="https://dashlink-t.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            View Live Website ↗
          </a>
        </div>

        {/* Prepared by */}
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.06em',
        }}>
          Prepared by <strong style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>Babajide Teslim</strong>
        </p>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
        <div style={{ width: '1px', height: '40px', background: 'white', animation: 'fadeIn 2s ease infinite alternate' }} />
      </div>
    </section>
  )
}

// --- Section 2: Vision ---
function Vision() {
  const ref = useReveal()
  const steps = [
    { step: 'Discover', desc: 'Social media, search and digital content' },
    { step: 'Explore', desc: 'Website, vehicles and technology products' },
    { step: 'Enquire', desc: 'WhatsApp, calls and physical locations' },
    { step: 'Convert', desc: 'Turn interest into genuine business enquiries' },
  ]

  return (
    <section id="vision" style={{ background: 'var(--off-white)', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
      <div ref={ref} className="section-reveal" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '64px', maxWidth: '680px' }}>
          <span className="tag-pill" style={{ marginBottom: '20px', display: 'inline-block' }}>The Vision</span>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            lineHeight: 1.15,
            color: 'var(--navy)',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}>
            One Brand. Two Businesses.<br />One Connected Digital Presence.
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: 'var(--gray)', lineHeight: 1.75 }}>
            Build a consistent digital presence that makes it easier for customers to discover Dashlink, explore available vehicles and technology, and connect directly with the business.
          </p>
        </div>

        {/* Customer Journey */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 200px' }}>
              <div style={{
                flex: 1,
                background: 'white',
                border: '1px solid var(--gray-light)',
                borderRight: i < steps.length - 1 ? 'none' : '1px solid var(--gray-light)',
                padding: '36px 28px',
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--red)',
                  marginBottom: '12px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'var(--navy)',
                  marginBottom: '10px',
                }}>
                  {s.step}
                </h3>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'var(--gray)', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-14px',
                    width: '24px',
                    height: '24px',
                    background: 'var(--red)',
                    borderRadius: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    fontSize: '10px',
                    color: 'white',
                  }}>↓</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Section 3: Website ---
function Website() {
  const ref = useReveal()
  const features = [
    'Dashlink Autos + Integrated Systems under one platform',
    'Vehicle and technology catalogues',
    'Mobile-first browsing',
    'Direct WhatsApp enquiries',
    'Product and vehicle galleries',
    'Pre-order vehicle enquiries',
    'Social & video integration',
  ]

  return (
    <section id="website" style={{ background: 'var(--navy)', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
      <div ref={ref} className="section-reveal" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '56px' }}>
          <span className="tag-pill" style={{ marginBottom: '20px', display: 'inline-block' }}>Website Experience</span>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            lineHeight: 1.15,
            color: 'white',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            Two Businesses.<br />One Digital Experience.
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', maxWidth: '520px', lineHeight: 1.7 }}>
            Designed to turn social media traffic into product discovery and direct enquiries.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'start' }}>
          {/* Website screenshot in browser frame */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}>
            {/* Browser chrome */}
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '22px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>dashlink-t.vercel.app</span>
              </div>
            </div>
            <img
              src="/assets/autos-instagram-mockup.png"
              alt="Dashlink website homepage"
              style={{ width: '100%', display: 'block' }}
            />
          </div>

          {/* Features + CTA */}
          <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://dashlink-t.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.82rem' }}
            >
              Explore the Live Website ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Section 4: Dashlink Integrated Autos ---
function Autos() {
  const ref = useReveal()
  const autosSlides = [
    '/assets/autos-carousel-cover.png',
    '/assets/autos-carousel-slide1.png',
    '/assets/autos-carousel-slide2.png',
    '/assets/autos-carousel-04.png',
  ]
  const categories = ['Vehicle Showcases', 'New Arrivals', 'Buying Guides', 'Vehicle Pre-Orders', 'Reels & Walkarounds', 'Customer-focused Content']

  return (
    <section id="autos" style={{ background: 'white', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
      <div ref={ref} className="section-reveal" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <span className="tag-pill" style={{ marginBottom: '20px', display: 'inline-block', background: 'var(--navy)' }}>Dashlink Integrated Autos</span>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            lineHeight: 1.15,
            color: 'var(--navy)',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            From simply showing cars to building automotive content people want to follow.
          </h2>
        </div>

        {/* Instagram mockup placeholder + Vehicle ad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '64px', alignItems: 'start' }}>
          {/* Autos Instagram mockup */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--navy)',
                borderBottom: '2px solid var(--navy)',
                paddingBottom: '3px',
              }}>Instagram Presence</span>
            </div>
            <img
              src="/assets/systems-hp-flyer.png"
              alt="Dashlink Integrated Autos Instagram"
              style={{ width: '100%', borderRadius: '8px', display: 'block', boxShadow: '0 8px 32px rgba(13,27,62,0.12)' }}
            />
          </div>

          {/* Vehicle ad */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--red)',
                borderBottom: '2px solid var(--red)',
                paddingBottom: '3px',
              }}>Product / Vehicle Content</span>
            </div>
            <img
              src="/assets/autos-vehicle-ad.png"
              alt="2017 Hyundai Elantra GT"
              style={{ width: '100%', borderRadius: '8px', display: 'block', boxShadow: '0 8px 32px rgba(13,27,62,0.1)' }}
            />
          </div>
        </div>

        {/* Educational carousel */}
        <div style={{ background: 'var(--navy)', borderRadius: '16px', padding: 'clamp(32px, 5vw, 56px)', marginBottom: '40px' }}>
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: '8px',
              }}>Educational Content</div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'white', margin: 0 }}>
                "Buying a Tokunbo Car?" Carousel
              </h3>
            </div>
            <span style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '5px 12px',
              borderRadius: '4px',
            }}>Proposed Content Direction</span>
          </div>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <Carousel slides={autosSlides} />
          </div>
        </div>

        {/* Content categories */}
        <div>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '20px' }}>
            Content should do more than display inventory. It should educate, build trust and create reasons for customers to return.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(c => (
              <span key={c} style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--navy)',
                border: '1px solid var(--gray-light)',
                padding: '6px 14px',
                borderRadius: '4px',
                letterSpacing: '0.03em',
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Section 5: Dashlink Integrated Systems ---
function Systems() {
  const ref = useReveal()
  const systemsSlides = [
    '/assets/systems-carousel-cover.png',
    '/assets/systems-carousel-slide2.png',
    '/assets/systems-instagram-mockup.png',
    '/assets/website-homepage.png',
  ]
  const categories = ['Product Showcases', 'New Arrivals', 'Laptop Buying Guides', 'Tech Comparisons', 'Accessories', 'Tech Tips', 'Reels & Product Reviews']

  return (
    <section id="systems" style={{ background: 'var(--off-white)', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
      <div ref={ref} className="section-reveal" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '64px' }}>
          <span className="tag-pill" style={{ marginBottom: '20px', display: 'inline-block' }}>Dashlink Integrated Systems</span>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            lineHeight: 1.15,
            color: 'var(--navy)',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            Turn products and technical knowledge into useful, engaging content.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '64px', alignItems: 'start' }}>
          {/* Laptop ad */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--red)',
                borderBottom: '2px solid var(--red)',
                paddingBottom: '3px',
              }}>Product Content</span>
            </div>
            <img
              src="/assets/systems-carousel-03.png"
              alt="HP EliteBook 840 G8"
              style={{ width: '100%', borderRadius: '8px', display: 'block', boxShadow: '0 8px 32px rgba(13,27,62,0.1)' }}
            />
          </div>

          {/* Systems Instagram mockup */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--navy)',
                borderBottom: '2px solid var(--navy)',
                paddingBottom: '3px',
              }}>Instagram Presence</span>
            </div>
            <img
              src="/assets/systems-carousel-04.png"
              alt="Dashlink Integrated Systems Instagram"
              style={{ width: '100%', borderRadius: '8px', display: 'block', boxShadow: '0 8px 32px rgba(13,27,62,0.12)' }}
            />
          </div>
        </div>

        {/* Educational carousel */}
        <div style={{ background: 'var(--navy)', borderRadius: '16px', padding: 'clamp(32px, 5vw, 56px)', marginBottom: '40px' }}>
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: '8px',
              }}>Educational / Buying Guide Content</div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'white', margin: 0 }}>
                RAM Comparison Carousel
              </h3>
            </div>
            <span style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '5px 12px',
              borderRadius: '4px',
            }}>Proposed Content Direction</span>
          </div>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <Carousel slides={systemsSlides} />
          </div>
        </div>

        {/* Categories */}
        <div>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '20px' }}>
            Help customers understand what they're buying, not just see what is available.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(c => (
              <span key={c} style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--navy)',
                border: '1px solid var(--gray-light)',
                padding: '6px 14px',
                borderRadius: '4px',
                background: 'white',
                letterSpacing: '0.03em',
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Section 6: Content Strategy ---
function Strategy() {
  const ref = useReveal()
  const pillars = [
    {
      num: '01',
      title: 'Sell',
      color: 'var(--navy)',
      items: ['Product showcases', 'New arrivals', 'Available vehicles', 'Promotions where applicable'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 14h20M14 4l10 10-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
    },
    {
      num: '02',
      title: 'Educate',
      color: 'var(--red)',
      items: ['Buying guides', 'Vehicle tips', 'Laptop comparisons', 'Technology education'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 8h20M4 14h14M4 20h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      ),
    },
    {
      num: '03',
      title: 'Engage',
      color: 'var(--navy)',
      items: ['Questions & polls', 'Useful tips', 'Short-form content', 'Community interaction'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="10" cy="14" r="6" stroke="currentColor" strokeWidth="1.8"/><circle cx="20" cy="10" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M16 17c1 2 3 3 5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      ),
    },
    {
      num: '04',
      title: 'Convert',
      color: 'var(--red)',
      items: ['Website visits', 'WhatsApp enquiries', 'Phone calls', 'Store & dealership visits'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6L23 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
    },
  ]

  return (
    <section id="strategy" style={{ background: 'var(--navy)', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
      <div ref={ref} className="section-reveal" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '64px', maxWidth: '600px' }}>
          <span className="tag-pill" style={{ marginBottom: '20px', display: 'inline-block' }}>Content Strategy</span>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            lineHeight: 1.15,
            color: 'white',
            letterSpacing: '-0.02em',
          }}>
            Not Just Posting.<br />A Content Strategy.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px' }}>
          {pillars.map((p, i) => (
            <div key={p.title} style={{
              background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)',
              padding: '40px 32px',
              transition: 'background 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,20,30,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)')}
            >
              <div style={{ color: p.color, marginBottom: '20px' }}>{p.icon}</div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{p.num}</div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'white', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {p.items.map(item => (
                  <li key={item} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', paddingLeft: '14px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--red)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.45)',
          marginTop: '48px',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          "Different content. One objective: keep Dashlink useful, visible and easy to contact."
        </p>
      </div>
    </section>
  )
}

// --- Section 7: Ecosystem ---
function Ecosystem() {
  const ref = useReveal()
  const svgRef = useRef<SVGSVGElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])

  const sources = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'Google']

  return (
    <section id="ecosystem" style={{ background: 'white', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
      <div ref={ref} className="section-reveal" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <span className="tag-pill" style={{ marginBottom: '20px', display: 'inline-block', background: 'var(--navy)' }}>Connected Digital Presence</span>
        <h2 style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          lineHeight: 1.15,
          color: 'var(--navy)',
          marginBottom: '64px',
          letterSpacing: '-0.02em',
        }}>
          Everything Works Together.
        </h2>

        {/* Flow diagram */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {/* Social sources */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
            {sources.map(s => (
              <div key={s} style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--navy)',
                border: '1px solid var(--gray-light)',
                padding: '8px 14px',
                borderRadius: '4px',
                background: 'var(--off-white)',
                transition: 'all 0.3s',
                opacity: animated ? 1 : 0,
                transform: animated ? 'translateY(0)' : 'translateY(-8px)',
                transitionDelay: `${sources.indexOf(s) * 0.08}s`,
              }}>{s}</div>
            ))}
          </div>

          {/* Arrow */}
          <FlowArrow animated={animated} delay={0.4} />

          {/* Dashlink */}
          <div style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'white',
            background: 'var(--navy)',
            padding: '14px 32px',
            borderRadius: '6px',
            marginBottom: '16px',
            opacity: animated ? 1 : 0,
            transform: animated ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.4s ease',
            transitionDelay: '0.5s',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>DASH</span>
            <span style={{ color: 'var(--red)' }}>LINK</span>
          </div>

          <FlowArrow animated={animated} delay={0.6} />

          {/* Website */}
          <div style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--navy)',
            border: '2px solid var(--navy)',
            padding: '10px 24px',
            borderRadius: '6px',
            marginBottom: '16px',
            opacity: animated ? 1 : 0,
            transition: 'opacity 0.4s ease',
            transitionDelay: '0.7s',
          }}>
            Website
          </div>

          {/* Fork to Vehicles + Technology */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '1px', height: '24px', background: 'var(--gray-light)' }} />
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--red)',
                border: '1px solid var(--red)',
                padding: '8px 16px',
                borderRadius: '4px',
                opacity: animated ? 1 : 0,
                transition: 'opacity 0.4s ease',
                transitionDelay: '0.85s',
              }}>Vehicles</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'var(--gray-light)', marginTop: '8px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '1px', height: '24px', background: 'var(--gray-light)' }} />
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--navy)',
                border: '1px solid var(--navy)',
                padding: '8px 16px',
                borderRadius: '4px',
                opacity: animated ? 1 : 0,
                transition: 'opacity 0.4s ease',
                transitionDelay: '0.9s',
              }}>Technology</div>
            </div>
          </div>

          <FlowArrow animated={animated} delay={1.0} />

          {/* Enquiry */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
            {['WhatsApp', 'Call', 'Visit'].map((s, i) => (
              <div key={s} style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'white',
                background: 'var(--red)',
                padding: '8px 14px',
                borderRadius: '4px',
                opacity: animated ? 1 : 0,
                transition: 'opacity 0.4s ease',
                transitionDelay: `${1.1 + i * 0.06}s`,
              }}>{s}</div>
            ))}
          </div>

          <FlowArrow animated={animated} delay={1.3} />

          {/* Customer */}
          <div style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'white',
            background: 'var(--navy)',
            padding: '12px 28px',
            borderRadius: '50px',
            opacity: animated ? 1 : 0,
            transition: 'opacity 0.4s ease',
            transitionDelay: '1.4s',
          }}>
            Customer
          </div>
        </div>
      </div>
    </section>
  )
}

function FlowArrow({ animated, delay }: { animated: boolean; delay: number }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0',
      margin: '4px 0',
      opacity: animated ? 1 : 0,
      transition: 'opacity 0.4s ease',
      transitionDelay: `${delay}s`,
    }}>
      <div style={{ width: '1px', height: '24px', background: 'var(--gray-light)' }} />
      <svg width="10" height="8" viewBox="0 0 10 8"><path d="M5 8L0 0h10z" fill="#d1d5db"/></svg>
    </div>
  )
}

// --- Section 8: Services ---
function Services() {
  const ref = useReveal()
  const setup = [
    'Website finalization and deployment',
    'Domain and hosting configuration',
    'Social profile optimization',
    'Content design system',
    'Google Business presence & optimization',
    'Analytics and enquiry tracking',
    'Platform consistency',
  ]
  const ongoing = [
    'Content planning',
    'Graphic design',
    'Social media content creation',
    'Reels & video editing',
    'Captions and publishing',
    'Posting & scheduling',
    'Community management',
    'Website vehicle & product updates',
    'Monthly performance reporting',
  ]

  return (
    <section id="services" style={{ background: 'var(--off-white)', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
      <div ref={ref} className="section-reveal" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '64px' }}>
          <span className="tag-pill" style={{ marginBottom: '20px', display: 'inline-block', background: 'var(--navy)' }}>Services</span>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            lineHeight: 1.15,
            color: 'var(--navy)',
            letterSpacing: '-0.02em',
            maxWidth: '640px',
          }}>
            A Complete Digital Presence — Not Just a Website.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {/* Setup */}
          <div style={{ background: 'var(--navy)', borderRadius: '12px', padding: '40px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(224,20,30,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="var(--red)" strokeWidth="1.5"/><path d="M9 5v4l3 2" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Initial Digital Setup</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {setup.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="6" height="6" viewBox="0 0 6 6"><path d="M1 3l1.5 1.5L5 1.5" stroke="var(--red)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ongoing */}
          <div style={{ background: 'white', border: '1px solid var(--gray-light)', borderRadius: '12px', padding: '40px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(13,27,62,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9a7 7 0 1 0 14 0A7 7 0 0 0 2 9z" stroke="var(--navy)" strokeWidth="1.5"/><path d="M9 5v4l2.5 2.5" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Ongoing Digital Management</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {ongoing.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="6" height="6" viewBox="0 0 6 6"><path d="M1 3l1.5 1.5L5 1.5" stroke="var(--navy)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'var(--gray)', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Section 9: Next Step ---
function NextStep() {
  const ref = useReveal()
  return (
    <section id="nextstep" style={{ background: 'var(--navy)', padding: 'clamp(100px, 12vw, 160px) clamp(20px, 6vw, 80px)', position: 'relative', overflow: 'hidden' }}>
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '140px', height: '140px', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 20, left: -24, width: '120px', height: '4px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: 32, left: -24, width: '100px', height: '2px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.4 }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '140px', height: '140px', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 20, right: -24, width: '120px', height: '4px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: 32, right: -24, width: '100px', height: '2px', background: 'var(--red)', transform: 'rotate(-45deg)', opacity: 0.4 }} />
      </div>

      <div ref={ref} className="section-reveal" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <img src="/assets/dashlink-logo-white.png" alt="Dashlink" style={{ height: '52px', objectFit: 'contain' }} />
        </div>

        <h2 style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          lineHeight: 1.1,
          color: 'white',
          marginBottom: '20px',
          letterSpacing: '-0.02em',
        }}>
          Ready to Strengthen<br />Dashlink's Digital Presence?
        </h2>

        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '48px',
          lineHeight: 1.7,
        }}>
          Website. Content. Social Media. One Connected Strategy.
        </p>

        <a
          href="https://dashlink-t.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ fontSize: '0.9rem', padding: '16px 36px', marginBottom: '64px', display: 'inline-flex' }}
        >
          View Live Website ↗
        </a>

        {/* Contact card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '36px 40px',
          textAlign: 'left',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>Prepared by</div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>Babajide Teslim</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>Phone</div>
            <a href="tel:+2347016609785" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'white', textDecoration: 'none' }}>
              +234 701 660 9785
            </a>
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>Email</div>
            <a href="mailto:idbabs24434@gmail.com" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'white', textDecoration: 'none' }}>
              idbabs24434@gmail.com
            </a>
          </div>
        </div>

        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.3)',
          marginTop: '48px',
          fontStyle: 'italic',
        }}>
          "Let's build a digital presence that reflects the quality of the business behind it."
        </p>
      </div>
    </section>
  )
}

// --- Main App ---
export default function App() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <Nav />
      <main>
        <Opening />
        <Vision />
        <Website />
        <Autos />
        <Systems />
        <Strategy />
        <Ecosystem />
        <Services />
        <NextStep />
      </main>
    </>
  )
}
