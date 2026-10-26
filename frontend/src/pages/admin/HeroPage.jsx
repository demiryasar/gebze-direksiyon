// HeroPage.jsx dosyasının güncellenmiş hali:

import { useEffect, useState } from 'react';
import api from '../../lib/api';


const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';



export default function HeroAdminPage() {
  const [form, setForm]             = useState({ title: '', subtitle: '', cta_text: '', cta_url: '' });
  const [bgFile, setBgFile]         = useState(null);
  const [mobileBgFile, setMobileBgFile] = useState(null); // Yeni Mobil State
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    api.get('/site-data').then((r) => {
      if (r.data.hero) setForm({ ...r.data.hero });
    });
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const fd = new FormData();

    // Sadece metin alanlarını ekliyoruz (Eski string resim yollarını FormData'ya eklemiyoruz!)
    fd.append('title', form.title || '');
    fd.append('subtitle', form.subtitle || '');
    fd.append('cta_text', form.cta_text || '');
    fd.append('cta_url', form.cta_url || '');

    // Eğer YENİ bir masaüstü dosyası seçildiyse ekle
    if (bgFile instanceof File) {
      fd.append('background_image', bgFile);
    }

    // Eğer YENİ bir mobil dosyası seçildiyse ekle
    if (mobileBgFile instanceof File) {
      fd.append('mobile_background_image', mobileBgFile);
    }

    await api.post('/admin/hero', fd);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch (err) {
    console.error("Hata Detayı:", err.response?.data);
    alert('Kayıt sırasında hata oluştu.');
  } finally {
    setSaving(false);
  }
};

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)' }}>Hero Banner</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Ana sayfa üst banner içeriğini düzenleyin</p>
      </div>

      <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: 'var(--shadow-sm)', maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ana Başlık *</label>
            <input className="form-input" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Alt Başlık</label>
            <input className="form-input" value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">CTA Buton Metni</label>
              <input className="form-input" value={form.cta_text || ''} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">CTA Buton URL</label>
              <input className="form-input" value={form.cta_url || ''} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="#iletisim" />
            </div>
          </div>

          {/* İki sütunlu görsel yükleme alanı */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Masaüstü Görseli (opsiyonel)</label>



              {/* Önizleme Mantığı:
                1. Eğer yeni bir dosya seçildiyse (mobileBgFile varsa) URL.createObjectURL ile onu göster.
                2. Yeni dosya yoksa ama veritabanından gelen eski resim varsa onu göster.
            */}
            {mobileBgFile ? (
                <img
                src={URL.createObjectURL(mobileBgFile)}
                alt="Yeni Seçilen Mobil Görseli"
                style={{ maxWidth: '100px', display: 'block', marginBottom: 8, borderRadius: 8 }}
                />
            ) : form.background_image ? (
                <img
                src={form.background_image.startsWith('http') ? form.background_image : `${STORAGE_URL}/${form.background_image}`}
                alt="Mevcut Masaüstü Görseli"
                style={{ maxWidth: '100px', display: 'block', marginBottom: 8, borderRadius: 8 }}
                />
            ) : null}



              <input type="file" accept="image/*" className="form-input" onChange={(e) => setBgFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobil Görseli (opsiyonel)</label>

              {/* Önizleme Mantığı:
                1. Eğer yeni bir dosya seçildiyse (mobileBgFile varsa) URL.createObjectURL ile onu göster.
                2. Yeni dosya yoksa ama veritabanından gelen eski resim varsa onu göster.
            */}
            {mobileBgFile ? (
                <img
                src={URL.createObjectURL(mobileBgFile)}
                alt="Yeni Seçilen Mobil Görseli"
                style={{ maxWidth: '100px', display: 'block', marginBottom: 8, borderRadius: 8 }}
                />
            ) : form.mobile_background_image ? (
                <img
                src={form.mobile_background_image.startsWith('http') ? form.mobile_background_image : `${STORAGE_URL}/${form.mobile_background_image}`}
                alt="Mevcut Mobil Görseli"
                style={{ maxWidth: '100px', display: 'block', marginBottom: 8, borderRadius: 8 }}
                />
            ) : null}


              <input type="file" accept="image/*" className="form-input" onChange={(e) => setMobileBgFile(e.target.files[0])} />
            </div>
          </div>

          {saved && (
            <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 12, padding: '14px 20px', marginBottom: 16, fontWeight: 600 }}>
              ✅ Hero banner güncellendi!
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '14px 40px' }}>
            {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
}
