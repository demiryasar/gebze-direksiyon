import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function ReviewsPage() {
  const [reviews, setReviews]   = useState([]);
  const [filter, setFilter]     = useState('pending');

  const load = (status) => {
    const f = status || filter;
    api.get(`/admin/reviews${f !== 'all' ? `?status=${f}` : ''}`).then((r) => setReviews(r.data));
  };

  useEffect(() => { load(); }, [filter]);

  const changeFilter = (f) => { setFilter(f); };

  const approve = async (id) => {
    await api.patch(`/admin/reviews/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    await api.patch(`/admin/reviews/${id}/reject`);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Bu yorumu silmek istiyor musunuz?')) return;
    await api.delete(`/admin/reviews/${id}`);
    load();
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  const FILTERS = [
    { value: 'all', label: 'Tümü' },
    { value: 'approved', label: 'Onaylanan' },
    { value: 'pending', label: 'Bekleyen' },
    { value: 'rejected', label: 'Reddedilen' },

  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Kullanıcı Yorumları
          {filter === 'pending' && pendingCount > 0 && (
            <span style={{
              background: '#ef4444', color: 'white',
              borderRadius: 100, padding: '2px 10px',
              fontSize: '0.9rem', marginLeft: 12,
            }}>{pendingCount}</span>
          )}
        </h1>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => changeFilter(f.value)}
            className="btn"
            style={{
              padding: '8px 20px', fontSize: '0.9rem',
              background: filter === f.value ? 'var(--color-navy)' : 'var(--color-light)',
              color: filter === f.value ? 'white' : 'var(--color-text)',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Reviews */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reviews.length === 0 && (
          <div style={{
            background: 'white', borderRadius: 16, padding: 40,
            textAlign: 'center', color: 'var(--color-text-muted)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            Bu filtrede yorum bulunmuyor.
          </div>
        )}



        {reviews.map((r) => (
          <div key={r.id} style={{
            background: 'white', borderRadius: 16, padding: '24px 28px',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: `4px solid ${r.status === 'approved' ? '#10b981' : r.status === 'rejected' ? '#ef4444' : '#f59e0b'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40,
                    background: 'linear-gradient(135deg, var(--color-primary), #ff9a6c)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.95rem',
                    fontFamily: 'Outfit, sans-serif',
                  }}>
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{r.name}</div>
                    <div className="stars" style={{ fontSize: '0.85rem' }}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                  </div>
                  <span className={`badge badge-${r.status}`} style={{ marginLeft: 8 }}>
                    {r.status === 'pending' ? '⏳ Bekliyor' : r.status === 'approved' ? '✅ Onaylı' : '❌ Reddedildi'}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginLeft: 'auto' }}>
                    {new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  "{r.comment}"
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {r.status !== 'approved' && (
                  <button onClick={() => approve(r.id)} className="btn"
                    style={{ background: '#d1fae5', color: '#065f46', padding: '8px 16px', fontSize: '0.85rem' }}>
                    ✅ Onayla
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => reject(r.id)} className="btn"
                    style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 16px', fontSize: '0.85rem' }}>
                    ❌ Reddet
                  </button>
                )}
                <button onClick={() => remove(r.id)} className="btn"
                  style={{ background: '#f1f5f9', color: '#64748b', padding: '8px 16px', fontSize: '0.85rem' }}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
