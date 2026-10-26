import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function ContactSection() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/site-data').then((r) => setSettings(r.data.settings || {})).catch(() => {});
  }, []);

  return (
    <section id="iletisim" className="section section-dark">
      <div className="container">
        <div className="section-header">
          <div className="section-tag" style={{ background: 'rgba(255,107,53,0.2)', color: '#FF6B35' }}>
            İletişim
          </div>
          <h2 className="section-title">Bize Ulaşın</h2>
          <p className="section-desc">
            Sorularınız için bizi arayabilir veya WhatsApp'tan mesaj gönderebilirsiniz.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 40,
          alignItems: 'start',
        }} className="contact-grid">
          {/* Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: '📞', label: 'Telefon', value: settings.phone, href: `tel:${settings.phone}` },
              { icon: '✉️', label: 'E-posta', value: settings.email, href: `mailto:${settings.email}` },
              { icon: '📍', label: 'Adres', value: settings.address, href: null },
            ].map((item) => item.value && (
              <div key={item.label} className="glass-card" style={{ padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{
                  width: 52, height: 52,
                  background: 'rgba(255,107,53,0.2)',
                  borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 4 }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>{item.value}</a>
                  ) : (
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer"
                  className="glass-card"
                  style={{ padding: '12px 20px', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                  📸 Instagram
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer"
                  className="glass-card"
                  style={{ padding: '12px 20px', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                  👥 Facebook
                </a>
              )}
            </div>

            {/* WhatsApp CTA */}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank" rel="noreferrer"
                className="btn btn-primary"
                style={{ justifyContent: 'center', marginTop: 8, padding: '18px 32px', fontSize: '1.05rem' }}
              >
                💬 WhatsApp ile Randevu Al
              </a>
            )}
          </div>

          {/* Map */}
          {settings.map_embed && (
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <iframe
                src={settings.map_embed}
                width="100%" height="420"
                style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy"
                title="Harita"
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
