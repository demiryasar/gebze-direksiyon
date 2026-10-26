import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function HeroSection() {
  const [hero, setHero] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/site-data').then((r) => {
      setHero(r.data.hero);
      setSettings(r.data.settings || {});
    }).catch(() => {});
  }, []);

  if (!hero) return (
    <section style={{ height: '100vh', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader"></div>
    </section>
  );

  const title    = hero?.title    || 'Güvenli Sürüş Eğitiminde Sedat Hoca';
  const subtitle = hero?.subtitle || 'Gebze\'nin En Deneyimli Direksiyon Eğitmeni ile Ehliyet Yolunda Güvendesiniz.';
  const ctaText  = hero?.cta_text || 'Hemen Başvur';
  const ctaUrl   = hero?.cta_url  || '#iletisim';
  const bgImage  = hero?.background_image;
  const mobileBgImage = hero?.mobile_background_image; // Mobil görsel verisi
  const whatsapp = settings.whatsapp;
  const whatsappNumber = whatsapp ? String(whatsapp).replace(/\D/g, '') : '';
  const phone = settings.phone || '0533 236 07 60';



  const desktopUrl = bgImage
    ? (bgImage.startsWith('http') ? bgImage : `http://localhost:8000/storage/${bgImage}`)
    : null;

  const mobileUrl = mobileBgImage
    ? (mobileBgImage.startsWith('http') ? mobileBgImage : `http://localhost:8000/storage/${mobileBgImage}`)
    : desktopUrl;

  return (
    <section id="anasayfa" className="hero-section responsive-hero">
      {/* Mobil cihazlar için üstte görünecek görsel alanı */}
      {mobileUrl && (
        <div className="hero-mobile-image-wrapper">
          <img src={mobileUrl} alt="Gebze Direksiyon Eğitimi - Sedat Hoca" />
        </div>
      )}

      {/* Masaüstünde arkada duran karartma katmanı (Mobilde pasif olacak) */}
      <div className="hero-overlay"></div>





      <div className="hero-container">

          {/* Badge */}

            <span className="hero-badge">🚗 Gebze'nin 1 Numarası</span>


          {/* Title */}
          <h1 className="hero-title">
          {title}
        </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
          {subtitle}
        </p>

          {/* CTA Buttons */}
          <div className="hero-btns" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href={ctaUrl} className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
              {ctaText}
            </a>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '1.05rem', padding: '16px 36px', borderColor: 'white', color: 'white' }}
              >
                💬 WhatsApp'tan Yaz
              </a>
            )}
          </div>

          {/* Stats row */}
          <div className="hero-stats" style={{
            display: 'flex', gap: 40, marginTop: 64, flexWrap: 'wrap',
          }}>
            {[
              { val: '5000+', label: 'Mezun Öğrenci' },
              { val: '15+', label: 'Yıl Deneyim' },
              { val: '100%', label: 'Başarı Oranı' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '2rem', fontWeight: 800,
                  color: 'var(--color-primary)',
                }}>{s.val}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

      </div>

      {whatsapp && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="hero-whatsapp-badge"
        >
          <div className="wa-icon-box">
            <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.249 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.753-1.464L0 24zm6.59-4.846c1.785 1.058 3.549 1.621 5.41 1.621 5.474 0 9.93-4.447 9.933-9.925.002-2.654-1.03-5.148-2.905-7.025-1.875-1.875-4.37-2.907-7.028-2.907-5.485 0-9.942 4.448-9.945 9.927-.001 1.944.515 3.842 1.496 5.514L4.743 21.03l4.904-1.286zm11.304-6.882c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
          </div>
          <div className="wa-text-box">
            <span className="wa-title">Sedat Hoca</span>
            <span className="wa-phone">{phone}</span>
          </div>
        </a>
      )}

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem',
        animation: 'float 2s ease-in-out infinite',
      }}>
        <span>Aşağı Kaydır</span>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>

      <style>{`
/*** ── onceki kodlar ----------------------------------────────────────────── */
        .hero-whatsapp-badge {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: #7FE3F8;
          color: #0F4C75;
          padding: 16px 28px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 168, 204, 0.35);
          text-decoration: none;
          z-index: 999;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.6);
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
        }

        .hero-whatsapp-badge:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 168, 204, 0.55);
          background: #00A8CC;
          color: #ffffff;
        }

        .wa-icon-box {
          background: #25D366;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
          flex-shrink: 0;
        }

        .wa-text-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.2;
        }

        .wa-title {
          font-size: 0.95rem;
          font-weight: 600;
          opacity: 0.9;
        }

        .wa-phone {
          font-size: 1.35rem;
          font-weight: 800;
        }

        /* ── MOBILE HERO ────────────────────── */
        .hero-section {
          min-height: 100vh;
        }
        .hero-container {
          padding-top: 120px;
          padding-bottom: 80px;
        }




/*** ── yeni kodlar ---------------------------------------------------------────────────────────── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background-image: ${desktopUrl ? `url(${desktopUrl})` : 'var(--grad-dark)'};
          background-size: cover;
          background-position: center;
          overflow: hidden;
          padding: 80px 0;
        }

        .hero-mobile-image-wrapper {
          display: none; /* Masaüstünde bu katmanı gizle */
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 100%);
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 zpx;
          color: #fff;
          padding-left: 5%;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(0, 212, 255, 0.2);
          color: #00d4ff;
          padding: 6px 16px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          max-w-xl: 800px;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #e0e0e0;
          max-width: 600px;
          line-height: 1.6;
          margin-bottom: 35px;
        }







/*** ── eski kodlar -----------------------------------------------------------------────────────────────── */
        @media (max-width: 768px) {

          .hero-btns a {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          /* Badge → sadece ikon dairesi */
          .hero-whatsapp-badge {
            background: transparent;
            border: none;
            box-shadow: none;
            border-radius: 50%;
          }
          .hero-whatsapp-badge:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 24px rgba(37, 211, 102, 0.5);
            background: transparent;
          }
          .wa-text-box {
            display: none;
          }
          .wa-icon-box {
            width: 56px;
            height: 56px;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
          }
          .wa-icon-box svg {
            width: 28px;
            height: 28px;
          }



/*** ── yeni kodlar ---------------------------------------------------------────────────────────── */
          .hero-section {
            flex-direction: column; /* Görsel üstte, içerik altta olsun */
            background-image: none !important; /* Arka plan resmini kaldırıyoruz */
            background-color: #11141a; /* Temiz koyu arka plan */
            padding: 0 0 40px 0;
            min-height: auto;
          }

          .hero-mobile-image-wrapper {
            display: block;
            width: 100%;
            max-height: 380px;
            overflow: hidden;
            position: relative;
          }

          .hero-mobile-image-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 20%; /* Resmin dikey konumlandırmasını ayarlar */
          }

          /* Resmi alt kısımla yumuşakça birleştirmek için hafif gölge overlay */
          .hero-mobile-image-wrapper::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(to top, #11141a, transparent);
          }

          /*--.hero-overlay {---*/
          /**  display: none;*/ /* Mobilde gerek kalmadı */
          /*--}---*/

          .hero-container {
            padding: 24px 20px 0 20px;
            text-align: left;
          }

          .hero-badge {
            font-size: 0.8rem;
            margin-bottom: 12px;
          }

          /* Yazı boyutlarını mobilde okunabilir ölçüde küçültüyoruz */
          .hero-title {
            font-size: 1.8rem;
            line-height: 1.3;
            margin-bottom: 12px;
          }

          .hero-subtitle {
            font-size: 0.95rem;
            line-height: 1.5;
            color: #b3b9c4;
            margin-bottom: 24px;
          }

          .hero-btns {
            flex-direction: column;
            gap: 12px;
            margin-bottom: 35px;
          }

          .btn-cta-primary, .btn-cta-secondary {
            display: block;
            width: 100%;
            text-align: center;
            padding: 12px;
            font-size: 1rem;
          }

          /* İstatistiklerin mobilde yan yana düzgünce sığması */
          .hero-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding-top: 20px;
          }

          .stat-item {
            text-align: center;
          }

          .stat-item h3 {
            font-size: 1.4rem;
          }

          .stat-item p {
            font-size: 0.75rem;
          }




        }
/*** ── onceki kodlar --------------------------------------------------────────────────────── */
        @media (max-width: 900px) and (min-width: 769px) {
          .hero-whatsapp-badge {
            bottom: 16px;
            right: 16px;
            padding: 12px 20px;
            gap: 12px;
          }
          .wa-icon-box {
            width: 36px;
            height: 36px;
          }
          .wa-phone {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
}
