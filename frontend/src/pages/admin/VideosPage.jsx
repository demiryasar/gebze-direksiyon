import { useEffect, useState } from 'react';
import api from '../../lib/api';

const EMPTY = { title: '', description: '', type: 'youtube', url: '', order: 0, is_active: true };
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

export default function VideosPage() {
  const [videos, setVideos]   = useState([]);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [saving, setSaving]   = useState(false);

  const load = () => api.get('/admin/videos').then((r) => setVideos(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setVideoFile(null); setThumbFile(null); setModal('create'); };
  const openEdit   = (v) => { setForm({ ...v }); setVideoFile(null); setThumbFile(null); setModal(v); };
  const closeModal = () => setModal(null);

  const [saveError, setSaveError] = useState('');

const save = async (e) => {
  e.preventDefault();
  setSaving(true);
  setSaveError('');
  try {
    const fd = new FormData();

    // Form verilerini FormData'ya ekle
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) {
        // Eski görsel/video adreslerinin (string) Laravel'e gitmesini engelliyoruz
        if (k === 'thumbnail' || k === 'file_path' || k === 'video') return;

        if (typeof v === 'boolean') {
          fd.append(k, v ? '1' : '0');
        } else {
          fd.append(k, v);
        }
      }
    });

    // Sadece yeni seçilen taze dosyalar varsa FormData'ya ekle
    if (videoFile instanceof File) fd.append('video', videoFile);
    if (thumbFile instanceof File) fd.append('thumbnail', thumbFile);

    if (modal === 'create') {
      // Yeni Ekleme
      await api.post('/admin/videos', fd);
    } else {
      // DÜZENLEME (GÜNCELLEME):
      // Hiçbir taklit yapmadan, rotanın istediği gibi SAF POST isteği atıyoruz
      await api.post(`/admin/videos/${modal.id}`, fd);
    }

    load();
    closeModal();
  } catch (err) {
    console.error("Video Kayıt Hatası:", err.response?.data);
    setSaveError(err.response?.data?.message || 'Kayıt sırasında hata oluştu.');
  } finally {
    setSaving(false);
  }
};


  const remove = async (id) => {
    if (!confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;
    await api.delete(`/admin/videos/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)' }}>Eğitim Videoları</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>{videos.length} video</p>
        </div>
        <button id="add-video-btn" className="btn btn-primary" onClick={openCreate}>+ Video Ekle</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Başlık</th><th>Tür</th><th>Sıra</th><th>Durum</th><th>İşlem</th></tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600 }}>{v.title}</td>
                <td>
                  <span className="badge badge-active">
                    {v.type === 'youtube' ? '▶ YouTube' : v.type === 'vimeo' ? '▶ Vimeo' : '📹 Dosya'}
                  </span>
                </td>
                <td>{v.order}</td>
                <td><span className={`badge badge-${v.is_active ? 'active' : 'inactive'}`}>{v.is_active ? 'Aktif' : 'Pasif'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(v)} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Düzenle</button>
                    <button onClick={() => remove(v.id)} style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {/* Modal Karartı Alanı: Dışarı tıklayınca kapanmaması için onClick olayını siliyoruz */}
        {modal && (
        <div className="modal" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            {/* Modal İçerik Kutusu: Şeffaflığı önlemek için kesin bir arka plan ve gölge veriyoruz */}
            <div className="modal-content" style={{
            background: '#ffffff', // Kesin beyaz arka plan (Şeffaflığı bitirir)
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: '#334155' // Yazıların okunabilir olması için koyu renk
            }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginBottom: 20 }}>
                {modal === 'create' ? '🎥 Yeni Video Ekle' : '📝 Videoyu Düzenle'}
            </h2>

            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Başlık *</label>
                <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea className="form-textarea" rows={2} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Video Türü *</label>
                <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="file">Dosya Yükle</option>
                </select>
              </div>

              {form.type !== 'file' ? (
                <div className="form-group">
                  <label className="form-label">Video URL *</label>
                  <input className="form-input" type="url" placeholder="https://youtube.com/watch?v=..." value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Video Dosyası (MP4, max 200MB)</label>
                  {modal !== 'create' && form.file_path && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                      Mevcut: {form.file_path.split('/').pop()}
                    </p>
                  )}
                  <input type="file" accept="video/mp4,video/mov,video/webm" className="form-input"
                    onChange={(e) => setVideoFile(e.target.files[0])} />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Thumbnail (opsiyonel)</label>
                <input type="file" accept="image/*" className="form-input" onChange={(e) => setThumbFile(e.target.files[0])} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Sıra</label>
                  <input type="number" className="form-input" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Durum</label>
                  <select className="form-select" value={form.is_active ? '1' : '0'} onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}>
                    <option value="1">Aktif</option>
                    <option value="0">Pasif</option>
                  </select>
                </div>
              </div>

                {/* NOT: Kodun şişmemesi için aradaki girdileri kısalttım, senin orijinal form girdilerin burada aynen dursun */}

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                    {saveError && (
                        <div style={{ flex: 1, background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem' }}>
                        ❌ {saveError}
                        </div>
                    )}
                    {/* İptal butonu zaten güvenli bir şekilde kapatıyor */}
                    <button type="button" onClick={closeModal} className="btn" style={{ background: '#e2e8f0', color: '#475569' }}>İptal</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
