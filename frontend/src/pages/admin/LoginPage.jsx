import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/admin/login', form);
      localStorage.setItem('admin_token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
        top: '-200px', right: '-100px', borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 40px 120px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, var(--color-primary), #ff9a6c)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 16px',
            boxShadow: 'var(--shadow-orange)',
          }}>🚗</div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.6rem', fontWeight: 800,
            color: 'var(--color-navy)',
          }}>Admin Paneli</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Gebze Direksiyon Eğitimi
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="admin@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#991b1b',
              borderRadius: 10, padding: '12px 16px',
              fontSize: '0.9rem', marginBottom: 16,
            }}>❌ {error}</div>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', padding: '16px 32px', fontSize: '1rem', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
