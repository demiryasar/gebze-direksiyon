import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function SettingsPage() {
  const [form, setForm] = useState({
    phone: '', email: '', address: '', whatsapp: '',
    instagram: '', facebook: '', youtube: '', map_embed: '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password state
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    api.get('/site-data').then((r) => {
      const s = r.data.settings || {};
      setForm((prev) => ({ ...prev, ...s }));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    setPwError('');
    setPwSaved(false);
    try {
      await api.post('/admin/change-password', pwForm);
      setPwSaved(true);
      setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      setTimeout(() => setPwSaved(false), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || err.response?.data?.errors?.current_password?.[0] || 'Şifre güncellenemedi.');
    } finally {
      setPwSaving(false);
    }
  };

  const F = ({ label, name, type = 'text', placeholder }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[name] || ''}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Site Ayarları
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>İletişim bilgileri ve sosyal medya linkleri</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Contact */}
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: 20, color: 'var(--color-navy)' }}>
              📞 İletişim Bilgileri
            </h3>
            <F label="Telefon" name="phone" placeholder="0262 000 00 00" />
            <F label="E-posta" name="email" type="email" placeholder="info@example.com" />
            <F label="Adres" name="address" placeholder="Gebze, Kocaeli" />
            <F label="WhatsApp (ülke koduyla, örn: 905332360760)" name="whatsapp" placeholder="905332360760" />
          </div>

          {/* Social Media */}
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: 20, color: 'var(--color-navy)' }}>
              📱 Sosyal Medya
            </h3>
            <F label="Instagram URL" name="instagram" placeholder="https://instagram.com/..." />
            <F label="Facebook URL" name="facebook" placeholder="https://facebook.com/..." />
            <F label="YouTube URL" name="youtube" placeholder="https://youtube.com/..." />
          </div>
        </div>

        {/* Map embed */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-sm)', marginTop: 24 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: 16, color: 'var(--color-navy)' }}>
            🗺️ Google Harita Embed URL
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
            Google Maps → Paylaş → Haritayı göm → iframe src URL'sini buraya yapıştırın
          </p>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={form.map_embed || ''}
            onChange={(e) => setForm({ ...form, map_embed: e.target.value })}
          />
        </div>

        {saved && (
          <div style={{
            background: '#d1fae5', color: '#065f46',
            borderRadius: 12, padding: '14px 20px',
            marginTop: 20, fontWeight: 600,
          }}>✅ Ayarlar başarıyla kaydedildi!</div>
        )}

        <div style={{ marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '14px 40px' }}>
            {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
          </button>
        </div>
      </form>

      {/* Password Change Card */}
      <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-sm)', marginTop: 32 }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: 8, color: 'var(--color-navy)' }}>
          🔒 Yönetici Şifresini Değiştir
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
          Admin paneli giriş şifrenizi buradan güvenle güncelleyebilirsiniz.
        </p>

        <form onSubmit={handlePasswordSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Mevcut Şifre</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={pwForm.current_password}
                onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Yeni Şifre (En az 6 karakter)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={pwForm.new_password}
                onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={pwForm.new_password_confirmation}
                onChange={(e) => setPwForm({ ...pwForm, new_password_confirmation: e.target.value })}
                required
              />
            </div>
          </div>

          {pwError && (
            <div style={{
              background: '#fee2e2', color: '#991b1b',
              borderRadius: 12, padding: '12px 18px',
              marginTop: 16, fontSize: '0.9rem', fontWeight: 500,
            }}>❌ {pwError}</div>
          )}

          {pwSaved && (
            <div style={{
              background: '#d1fae5', color: '#065f46',
              borderRadius: 12, padding: '12px 18px',
              marginTop: 16, fontSize: '0.9rem', fontWeight: 600,
            }}>✅ Şifreniz başarıyla güncellendi!</div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pwSaving}
              style={{ padding: '12px 32px' }}
            >
              {pwSaving ? 'Güncelleniyor...' : '🔑 Şifreyi Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
