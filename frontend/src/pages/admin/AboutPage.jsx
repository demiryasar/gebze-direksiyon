import { useEffect, useState } from 'react';
import api from '../../lib/api';

const DEFAULT_STATS = [
  { value: '5000+', label: 'Mutlu Öğrenci' },
  { value: '15', label: 'Yıl Deneyim' },
  { value: '8', label: 'Uzman Eğitmen' },
  { value: '%95', label: 'Başarı Oranı' },
];

export default function AboutAdminPage() {
  const [content, setContent] = useState('');
  const [stats, setStats]     = useState(DEFAULT_STATS);
  const [imgFile, setImgFile] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    api.get('/site-data').then((r) => {
      if (r.data.about) {
        setContent(r.data.about.content || '');
        setStats(r.data.about.stats || DEFAULT_STATS);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
        const fd = new FormData();
        fd.append('content', content);
        fd.append('stats', JSON.stringify(stats));

        // YALNIZCA yeni bir görsel dosyası seçildiyse FormData'ya ekle
        if (imgFile instanceof File) {
        fd.append('image', imgFile);
        }

        await api.post('/admin/about', fd);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    } catch (err) {
        // Hatanın tam nedenini tarayıcı konsolunda net görmek için:
        console.error("Hakkımızda Validasyon Hatası:", err.response?.data);
        alert('Kayıt sırasında hata oluştu.');
    } finally {
        setSaving(false);
    }
    };

  const updateStat = (i, key, val) => {
    const updated = stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    setStats(updated);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)' }}>Hakkımızda</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Hakkımızda sayfasının içeriğini düzenleyin</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: 20, color: 'var(--color-navy)' }}>
              📝 İçerik (HTML destekli)
            </h3>
            <textarea
              className="form-textarea"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<p>Hakkımızda metni...</p>"
            />
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Fotoğraf</label>
              <input type="file" accept="image/*" className="form-input" onChange={(e) => setImgFile(e.target.files[0])} />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: 20, color: 'var(--color-navy)' }}>
              📊 İstatistikler
            </h3>
            {stats.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <input
                  className="form-input"
                  placeholder="Değer (örn: 5000+)"
                  value={s.value || s.val || ''}
                  onChange={(e) => updateStat(i, 'value', e.target.value)}
                />
                <input
                  className="form-input"
                  placeholder="Etiket (örn: Öğrenci)"
                  value={s.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {saved && (
          <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 12, padding: '14px 20px', marginTop: 20, fontWeight: 600 }}>
            ✅ Hakkımızda sayfası güncellendi!
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '14px 40px' }}>
            {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
