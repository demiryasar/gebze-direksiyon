import { useEffect, useState } from 'react';
import api from '../lib/api';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: '1.6rem',
            color: star <= (hover || value) ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.15s ease, transform 0.15s ease',
            transform: star <= (hover || value) ? 'scale(1.1)' : 'scale(1)',
          }}
        >★</button>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm]       = useState({ name: '', rating: 5, comment: '' });
  const [status, setStatus]   = useState(null); // 'sending' | 'success' | 'error'

  useEffect(() => {
    api.get('/reviews').then((r) => setReviews(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/reviews', form);
      setStatus('success');
      setForm({ name: '', rating: 5, comment: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="yorumlar" className="section section-light">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Yorumlar</div>
          <h2 className="section-title">Öğrencilerimiz Ne Diyor?</h2>
          <p className="section-desc">
            Binlerce mutlu öğrencimizden gelen gerçek yorumlar.
          </p>
        </div>

        {/* Reviews grid */}
        {reviews.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24, marginBottom: 60,
          }}>
            {reviews.map((r) => (
              <div key={r.id} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48,
                    background: 'var(--grad-main)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'Outfit, sans-serif',
                    fontWeight: 700, fontSize: '1.1rem',
                  }}>
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem' }}>{r.name}</div>
                    <div className="stars" style={{ fontSize: '0.9rem' }}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Review form */}
        <div style={{
          background: 'white',
          borderRadius: 24,
          padding: 40,
          maxWidth: 600,
          margin: '0 auto',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.4rem', fontWeight: 700,
            color: 'var(--color-navy)', marginBottom: 24,
          }}>Siz de Yorum Yapın</h3>

          {status === 'success' ? (
            <div style={{
              background: '#d1fae5', color: '#065f46',
              borderRadius: 12, padding: 20, textAlign: 'center',
            }}>
              ✅ Yorumunuz alındı! Onaylandıktan sonra yayınlanacaktır.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Adınız *</label>
                <input
                  id="review-name"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required placeholder="Adınız Soyadınız"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Puanınız *</label>
                <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
              </div>
              <div className="form-group">
                <label className="form-label">Yorumunuz *</label>
                <textarea
                  id="review-comment"
                  className="form-textarea"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  required placeholder="Eğitim deneyiminizi paylaşın..."
                  rows={4}
                />
              </div>
              {status === 'error' && (
                <p style={{ color: '#dc2626', marginBottom: 12, fontSize: '0.9rem' }}>
                  Bir hata oluştu, tekrar deneyin.
                </p>
              )}
              <button
                id="review-submit"
                type="submit"
                className="btn btn-primary w-full"
                disabled={status === 'sending'}
                style={{ justifyContent: 'center' }}
              >
                {status === 'sending' ? 'Gönderiliyor...' : 'Yorumu Gönder'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
