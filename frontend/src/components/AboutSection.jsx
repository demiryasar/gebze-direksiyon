import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

export default function AboutSection() {
  const [about, setAbout] = useState(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/site-data').then((r) => setAbout(r.data.about)).catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = about?.stats || [
    { value: '5000+', label: 'Mutlu Öğrenci' },
    { value: '15', label: 'Yıl Deneyim' },
    { value: '8', label: 'Uzman Eğitmen' },
    { value: '%95', label: 'Başarı Oranı' },
  ];

  const content = about?.content || '<p>Gebze Direksiyon Eğitimi olarak 2010 yılından bu yana Gebze ve çevresinde binlerce sürücü adayına kaliteli ve güvenli sürüş eğitimi vermekteyiz.</p>';

  return (
    <section id="hakkimizda" className="section" ref={ref}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }} className="about-grid">
          {/* Left: Content */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 0.7s ease',
          }}>
            <div className="section-tag">Hakkımızda</div>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              Sürüş Eğitiminde <span className="text-primary">15 Yıllık</span> Deneyim
            </h2>
            <div
              style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 32 }}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Feature list */}
            {[
              'Uzman ve sertifikalı eğitmen kadrosu',
              'Modern ve bakımlı araç filosu',
              'Esnek saat seçenekleri',
              'İlk denemede sınav başarısı garantisi',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 24, height: 24,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Right: Image & Stats */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'all 0.7s ease 0.2s',
          }}>
            {about?.image && (
              <img
                src={about.image.startsWith('http') ? about.image : `${STORAGE_URL}/${about.image}`}
                alt="Hakkımızda"
                style={{ borderRadius: 24, marginBottom: 32, boxShadow: 'var(--shadow-lg)', width: '100%', objectFit: 'cover', height: 350 }}
              />
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  background: i % 2 === 0
                    ? 'var(--grad-dark)'
                    : 'var(--grad-main)',
                  borderRadius: 20,
                  padding: 32,
                  color: 'white',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '2.2rem', fontWeight: 900,
                    marginBottom: 8,
                  }}>{s.value || s.val}</div>
                  <div style={{ opacity: 0.9, fontSize: '0.9rem', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
