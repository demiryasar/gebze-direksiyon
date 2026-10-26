import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function SettingsPage() {
  const [form, setForm] = useState({
    phone: '', email: '', address: '', whatsapp: '',
    instagram: '', facebook: '', youtube: '', map_embed: '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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
    </div>
  );
}
