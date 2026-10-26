import { useEffect, useState } from 'react';
import api from '../lib/api';

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

function getEmbedUrl(video) {
  if (video.type === 'youtube') {
    const id = video.url?.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
  }
  if (video.type === 'vimeo') {
    const id = video.url?.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return null; // file — use <video>
}

function getThumbnail(video) {
  if (video.thumbnail) {
    return video.thumbnail.startsWith('http') ? video.thumbnail : `${STORAGE_URL}/${video.thumbnail}`;
  }
  if (video.type === 'youtube') {
    const id = video.url?.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  // Default placeholder if no thumb
  return 'https://gebzedireksiyonegitimi.com/sedat/images/gebze-direksiyon-dersi-sedat-hoca-3.jpg';
}

export default function VideosSection() {
  const [videos, setVideos]     = useState([]);
  const [active, setActive]     = useState(null);

  useEffect(() => {
    api.get('/videos').then((r) => setVideos(r.data)).catch(() => {});
  }, []);

  if (!videos.length) return null;

  return (
    <section id="egitim-videolari" className="section section-dark">
      <div className="container">
        <div className="section-header">
          <div className="section-tag" style={{ background: 'rgba(0,168,204,0.2)', color: 'var(--color-primary)' }}>
            Eğitim Videoları
          </div>
          <h2 className="section-title">Videolarımızı İzleyin</h2>
          <p className="section-desc">
            Sürüş teknikleri, park manevraları ve trafik kuralları hakkında Sedat Hoca'nın hazırladığı eğitici videolar.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {videos.map((video) => {
            const thumb = getThumbnail(video);
            return (
              <div
                key={video.id}
                className="glass-card"
                style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setActive(video)}
              >
                {/* Thumbnail */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  background: 'var(--color-secondary)',
                  overflow: 'hidden',
                }}>
                  {thumb && (
                    <img
                      src={thumb}
                      alt={video.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                    />
                  )}
                  {/* Play button */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                  }}>
                    <div style={{
                      width: 60, height: 60,
                      background: 'var(--color-primary)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'var(--shadow-orange)',
                      transition: 'transform 0.2s ease',
                    }}>
                      <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Type badge */}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    borderRadius: 6, padding: '3px 10px',
                    fontSize: '0.72rem', fontWeight: 600, color: 'white',
                    textTransform: 'uppercase', letterSpacing: 1,
                  }}>
                    {video.type === 'file' ? '📹 Video' : video.type === 'youtube' ? '▶ YouTube' : '▶ Vimeo'}
                  </div>
                </div>

                <div style={{ padding: '20px 24px' }}>
                  <h3 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '1.05rem', fontWeight: 700,
                    color: 'white', marginBottom: 8,
                  }}>{video.title}</h3>
                  {video.description && (
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div className="video-overlay" onClick={() => setActive(null)}>
          <button className="video-close" onClick={() => setActive(null)}>✕</button>
          <div onClick={(e) => e.stopPropagation()}>
            {active.type === 'file' ? (
              <video
                src={active.url?.startsWith('http') ? active.url : `${STORAGE_URL}/${active.file_path}`}
                controls autoPlay
                style={{ width: '100%', maxWidth: 900, borderRadius: 12, maxHeight: '80vh' }}
              />
            ) : (
              <iframe
                src={getEmbedUrl(active)}
                title={active.title}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </section>

  );
}
