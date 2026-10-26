import { useEffect, useState } from 'react';
import api from '../../lib/api';

const EMPTY = { title: '', description: '', icon: '🚗', order: 0, is_active: true };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [modal, setModal]       = useState(null); // null | 'create' | service object
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);

  const load = () => api.get('/admin/services').then((r) => setServices(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (s) => { setForm({ ...s }); setModal(s); };
  const closeModal = () => setModal(null);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/admin/services', form);
      } else {
        await api.put(`/admin/services/${modal.id}`, form);
      }
      await load();
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    await api.delete(`/admin/services/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)' }}>Hizmetler</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>{services.length} hizmet</p>
        </div>
        <button id="add-service-btn" className="btn btn-primary" onClick={openCreate}>+ Hizmet Ekle</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>İkon</th><th>Başlık</th><th>Açıklama</th><th>Sıra</th><th>Durum</th><th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td style={{ fontSize: '1.5rem' }}>{s.icon}</td>
                <td style={{ fontWeight: 600 }}>{s.title}</td>
                <td style={{ color: 'var(--color-text-muted)', maxWidth: 300 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</div>
                </td>
                <td>{s.order}</td>
                <td>
                  <span className={`badge badge-${s.is_active ? 'active' : 'inactive'}`}>
                    {s.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(s)} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Düzenle</button>
                    <button onClick={() => remove(s.id)} style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: 24 }}>
              {modal === 'create' ? 'Yeni Hizmet' : 'Hizmet Düzenle'}
            </h2>
            <form onSubmit={save}>
              <div className="form-group">
                <label className="form-label">Başlık *</label>
                <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama *</label>
                <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">İkon (emoji)</label>
                  <input className="form-input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                </div>
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
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={closeModal} className="btn" style={{ background: 'var(--color-light)' }}>İptal</button>
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
