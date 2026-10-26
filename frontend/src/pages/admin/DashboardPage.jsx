import { useEffect, useState } from 'react';
import api from '../../lib/api';

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: '28px 32px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex', alignItems: 'center', gap: 20,
    }}>
      <div style={{
        width: 60, height: 60,
        background: color + '18',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem', flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>{label}</div>
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800, fontSize: '2rem',
          color: 'var(--color-navy)',
        }}>{value ?? '—'}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/admin/services'),
      api.get('/admin/videos'),
      api.get('/admin/reviews'),
    ]).then(([s, v, r]) => {
      setStats({
        services: s.data.length,
        videos:   v.data.length,
        reviews:  r.data.length,
        pending:  r.data.filter((rev) => rev.status === 'pending').length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Hoş Geldiniz 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 6 }}>
          Gebze Direksiyon Eğitimi — Yönetim Paneli
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 24, marginBottom: 40,
      }}>
        <StatCard icon="🛠️" label="Toplam Hizmet"   value={stats.services} color="#3b82f6" />
        <StatCard icon="🎬" label="Toplam Video"    value={stats.videos}   color="#8b5cf6" />
        <StatCard icon="⭐" label="Toplam Yorum"    value={stats.reviews}  color="#f59e0b" />
        <StatCard icon="⏳" label="Onay Bekleyen"   value={stats.pending}  color="#ef4444" />
      </div>

      {/* Quick links */}
      <div style={{
        background: 'white', borderRadius: 20, padding: 28,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: '1.1rem', marginBottom: 20, color: 'var(--color-navy)',
        }}>Hızlı Erişim</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { href: '/admin/reviews', label: '⭐ Yorumları Yönet', urgent: stats.pending > 0 },
            { href: '/admin/services', label: '🛠️ Hizmet Ekle' },
            { href: '/admin/videos', label: '🎬 Video Ekle' },
            { href: '/admin/settings', label: '⚙️ Ayarları Güncelle' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="btn"
              style={{
                background: link.urgent ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'var(--color-light)',
                color: link.urgent ? 'white' : 'var(--color-text)',
                padding: '10px 20px', fontSize: '0.9rem',
              }}
            >
              {link.label}
              {link.urgent && stats.pending > 0 && (
                <span style={{
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: 100, padding: '2px 8px',
                  fontSize: '0.8rem', fontWeight: 700,
                }}>{stats.pending}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
