import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function ServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data)).catch(() => {
      setServices([
        { id: 1, icon: '🚗', title: 'B Sınıfı Ehliyet', description: 'Otomobil kullanmak isteyenler için kapsamlı B sınıfı direksiyon eğitimi.' },
        { id: 2, icon: '🏍️', title: 'Motosiklet Eğitimi', description: 'A1, A2 ve A sınıfı motosiklet ehliyet eğitimleri uzman eğitmenlerle.' },
        { id: 3, icon: '🎯', title: 'Özel Direksiyon Dersi', description: 'Kendi aracınızla veya okul aracımızla birebir özel sürüş eğitimi.' },
        { id: 4, icon: '🅿️', title: 'Park Çalışması', description: 'Paralel park, dik park ve geri manevra konularında pratik eğitim.' },
      ]);
    });
  }, []);

  return (
    <section id="hizmetlerimiz" className="section section-light">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Hizmetlerimiz</div>
          <h2 className="section-title">Sunduğumuz Eğitimler</h2>
          <p className="section-desc">
            Profesyonel eğitmen kadromuz ve modern araç filomuzla tüm ehliyet sınıflarında eğitim veriyoruz.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 28,
        }}>
          {services.map((service, i) => (
            <div key={service.id} className="card" style={{ padding: 32 }}>
              {/* Icon */}
              <div style={{
                width: 72, height: 72,
                background: 'linear-gradient(135deg, rgba(0,168,204,0.12), rgba(0,168,204,0.05))',
                border: '1px solid rgba(0,168,204,0.2)',
                borderRadius: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: 24,
                transition: 'transform 0.3s ease',
              }}>
                {service.icon || '🚗'}
              </div>

              {/* Number */}
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.75rem', fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: 2, textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.3rem', fontWeight: 700,
                color: 'var(--color-navy)',
                marginBottom: 12,
              }}>{service.title}</h3>

              <p style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
              }}>{service.description}</p>

              {/* Bottom accent */}
              <div style={{
                height: 3,
                background: 'linear-gradient(90deg, var(--color-primary), transparent)',
                borderRadius: 2,
                marginTop: 24,
                width: '40%',
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
