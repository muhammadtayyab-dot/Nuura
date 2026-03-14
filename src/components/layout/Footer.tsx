import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1714', color: '#FAF8F4' }}>
      <div
        style={{
          padding: '80px 1.5rem',
          borderBottom: '1px solid rgba(250,248,244,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '64px',
            letterSpacing: '0.4em',
            color: '#FAF8F4',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}
        >
          NUURA
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '20px',
            color: '#8C8078',
            marginBottom: '1.75rem',
            textAlign: 'center',
          }}
        >
          Crafted for grace, rooted in ritual.
        </p>
        <div style={{ width: '60px', height: '1px', backgroundColor: '#C4614A' }} />
      </div>

      <div
        className='grid grid-cols-1 md:grid-cols-4 gap-12'
        style={{
          padding: '60px clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#8C8078', marginBottom: '1.5rem' }}>Explore</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href='/shop' className='footer-link' style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(250,248,244,0.5)', textDecoration: 'none' }}>Shop All</Link></li>
            <li><Link href='/about' className='footer-link' style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(250,248,244,0.5)', textDecoration: 'none' }}>Our Story</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#8C8078', marginBottom: '1.5rem' }}>Assistance</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href='/faq' className='footer-link' style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(250,248,244,0.5)', textDecoration: 'none' }}>FAQ</Link></li>
            <li><Link href='/contact' className='footer-link' style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(250,248,244,0.5)', textDecoration: 'none' }}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#8C8078', marginBottom: '1.5rem' }}>Social</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='social-link' style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078', textDecoration: 'none' }}>Instagram</a></li>
            <li><a href='https://tiktok.com' target='_blank' rel='noopener noreferrer' className='social-link' style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078', textDecoration: 'none' }}>TikTok</a></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#8C8078', marginBottom: '1.5rem' }}>Newsletter</h3>
          <div style={{ display: 'flex' }}>
            <input
              type='email'
              placeholder='YOUR EMAIL'
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 0,
                borderBottom: '1px solid rgba(250,248,244,0.15)',
                color: '#FAF8F4',
                paddingBottom: '0.6rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(250,248,244,0.08)',
          padding: '1.5rem clamp(1.5rem, 6vw, 5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: 'rgba(250,248,244,0.25)',
        }}
      >
        <span>© 2025 Nuura</span>
        <span>Crafted with intention in Pakistan 🇵🇰</span>
      </div>

      <style jsx>{`
        .footer-link:hover {
          color: #faf8f4 !important;
        }
        .social-link:hover {
          color: #c4614a !important;
        }
        input::placeholder {
          color: rgba(250, 248, 244, 0.3);
        }
        input:focus {
          border-bottom-color: #c4614a !important;
        }
      `}</style>
    </footer>
  )
}
