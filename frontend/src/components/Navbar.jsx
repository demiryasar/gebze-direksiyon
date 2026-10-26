import { useEffect, useState } from 'react';
import api from '../lib/api';

const NAV_LINKS = [
  { href: '#anasayfa',         label: 'Ana Sayfa' },
  { href: '#hakkimizda',       label: 'Hakkımızda' },
  { href: '#hizmetlerimiz',    label: 'Hizmetlerimiz' },
  { href: '#egitim-videolari', label: 'Eğitim Videoları' },
  { href: '#yorumlar',         label: 'Yorumlar' },
  { href: '#iletisim',         label: 'İletişim' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    api.get('/site-data').then((r) => setSettings(r.data.settings || {})).catch(() => {});
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      background: scrolled ? 'rgba(10,22,40,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px',
      }}>
        {/* Logo */}
        <a href="#anasayfa" style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800, fontSize: '1.2rem', color: 'white',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            background: 'var(--color-primary)',
            borderRadius: 10, padding: '6px 10px',
            fontSize: '1rem',
          }}>🚗</div>
          <span>Gebze <span style={{ color: 'var(--color-primary)' }}>Direksiyon</span></span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 32 }} className="nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500, fontSize: '0.95rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >{link.label}</a>
          ))}
        </div>

        {/* Phone CTA */}
        {settings.phone && (
          <a href={`tel:${settings.phone}`} className="btn btn-primary nav-phone-btn" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
            📞 <span className="phone-text">{settings.phone}</span>
          </a>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 600px) {
          .nav-phone-btn {
            padding: 10px 14px !important;
          }
          .phone-text {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
