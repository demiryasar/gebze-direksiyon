import { useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import api from '../../lib/api';

const NAV = [
  { to: '/admin',           icon: '📊', label: 'Dashboard',    end: true },
  { to: '/admin/services',  icon: '🛠️', label: 'Hizmetler' },
  { to: '/admin/videos',    icon: '🎬', label: 'Videolar' },
  { to: '/admin/reviews',   icon: '⭐', label: 'Yorumlar' },
  { to: '/admin/hero',      icon: '🖼️', label: 'Hero Banner' },
  { to: '/admin/about',     icon: '📖', label: 'Hakkımızda' },
  { to: '/admin/settings',  icon: '⚙️', label: 'Ayarlar' },
];

function SidebarContent({ onClose, logout }) {
  return (
    <>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Outfit, sans-serif' }}>
          <div style={{
            background: 'var(--color-primary)',
            borderRadius: 10, padding: '8px 10px', fontSize: '1.1rem',
          }}>🚗</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Gebze Direksiyon</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>Admin Panel</div>
          </div>
        </div>
        {/* Close button — only visible on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Menüyü kapat"
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.08)',
              border: 'none', borderRadius: 8,
              color: 'white', fontSize: '1.2rem',
              width: 36, height: 36,
              cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
            }}
            className="sidebar-close-btn"
          >✕</button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 12,
              marginBottom: 4,
              color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(0,168,204,0.2)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontFamily: 'Outfit, sans-serif', fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          id="admin-logout"
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '12px 16px', borderRadius: 12,
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            cursor: 'pointer', border: 'none', background: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
        >
          <span>🚪</span> Çıkış Yap
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    try { await api.post('/admin/logout'); } catch {}
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <SidebarContent logout={logout} />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`admin-sidebar-mobile${mobileOpen ? ' open' : ''}`}>
        <SidebarContent onClose={() => setMobileOpen(false)} logout={logout} />
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Hamburger — only on mobile */}
            <button
              id="admin-hamburger"
              aria-label="Menüyü aç"
              onClick={() => setMobileOpen(true)}
              className="hamburger-btn"
            >
              <span /><span /><span />
            </button>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-navy)' }}>
              Yönetim Paneli
            </h2>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--color-primary)', fontWeight: 600,
              fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            🌐 Siteyi Görüntüle ↗
          </a>
        </div>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>

      <style>{`
        /* ── MOBILE SIDEBAR ────────────────────────────── */
        .admin-sidebar-mobile {
          display: none;
        }
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          padding: 6px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .hamburger-btn:hover { background: rgba(0,168,204,0.08); }
        .hamburger-btn span {
          display: block;
          height: 2px;
          background: var(--color-navy);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .mobile-sidebar-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          /* Hide desktop sidebar */
          .admin-sidebar { display: none; }
          .admin-content { margin-left: 0; }

          /* Show hamburger */
          .hamburger-btn { display: flex; }

          /* Mobile overlay */
          .mobile-sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(3px);
            z-index: 200;
            animation: fadeIn 0.2s ease;
          }

          /* Mobile drawer */
          .admin-sidebar-mobile {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0; left: 0; bottom: 0;
            width: 260px;
            background: var(--color-navy);
            color: white;
            z-index: 300;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .admin-sidebar-mobile.open {
            transform: translateX(0);
          }
          /* Show close button inside mobile drawer */
          .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
