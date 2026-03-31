export default function Landing({ onStart, onOrg }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--green-deep)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🌿</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Greenprint
          </span>
        </div>
        <button onClick={onOrg} style={{
          padding: '8px 18px',
          border: '1.5px solid var(--border)',
          borderRadius: 100,
          background: 'transparent',
          color: 'var(--muted)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--green-mid)'; e.target.style.color = 'var(--green-mid)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)'; }}
        >
          For organisations →
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: 720,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--green-light)',
          border: '1px solid #bbf7d0',
          borderRadius: 100,
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--green-mid)',
          marginBottom: 32,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-bright)', display: 'inline-block' }} />
          India's first digital carbon index
        </div>

        {/* Headline */}
        <h1 className="serif animate-fade-up-2" style={{
          fontSize: 'clamp(44px, 7vw, 72px)',
          lineHeight: 1.1,
          color: 'var(--ink)',
          marginBottom: 24,
          letterSpacing: '-0.02em',
        }}>
          How much CO₂ do<br />
          <span style={{ color: 'var(--green-mid)' }}>your internet habits</span><br />
          produce?
        </h1>

        <p className="animate-fade-up-3" style={{
          fontSize: 18,
          color: 'var(--muted)',
          lineHeight: 1.7,
          marginBottom: 48,
          maxWidth: 480,
        }}>
          Answer 10 questions. Get your Behavioral Digital Carbon Index —
          personalised to your city, profession, and lifestyle.
        </p>

        {/* CTA */}
        <div className="animate-fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={onStart} style={{
            padding: '16px 36px',
            background: 'var(--green-deep)',
            color: 'white',
            border: 'none',
            borderRadius: 100,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.2s',
            letterSpacing: '-0.01em',
          }}
            onMouseEnter={e => { e.target.style.background = 'var(--green-mid)'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--green-deep)'; e.target.style.transform = 'translateY(0)'; }}
          >
            Check my score →
          </button>
        </div>

        {/* Trust signals */}
        <div className="animate-fade-up-3" style={{
          marginTop: 48,
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            ['🕐', 'Takes 2 minutes'],
            ['🔒', 'No account needed'],
            ['🇮🇳', 'India-adjusted'],
            ['🤖', 'AI-powered nudges'],
          ].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          marginTop: 72,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          width: '100%',
          maxWidth: 520,
        }}>
          {[
            ['5,000+', 'User profiles analysed'],
            ['3', 'ML models compared'],
            ['8', 'Research steps'],
          ].map(([num, label]) => (
            <div key={label} style={{
              background: 'var(--cream)',
              padding: '24px 16px',
              textAlign: 'center',
            }}>
              <div className="serif" style={{ fontSize: 32, color: 'var(--green-mid)', lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '20px 40px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
        color: 'var(--muted)',
      }}>
        <span>© 2025 Greenprint · Open source</span>
        <span>Built on IEA · Shift Project · Obringer et al.</span>
      </div>
    </div>
  )
}
