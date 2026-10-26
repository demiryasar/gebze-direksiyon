import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public site
import Navbar          from './components/Navbar';
import HeroSection     from './components/HeroSection';
import AboutSection    from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import VideosSection   from './components/VideosSection';
import ReviewsSection  from './components/ReviewsSection';
import ContactSection  from './components/ContactSection';

// Admin
import ProtectedRoute  from './components/ProtectedRoute';
import LoginPage       from './pages/admin/LoginPage';
import AdminLayout     from './pages/admin/AdminLayout';
import DashboardPage   from './pages/admin/DashboardPage';
import ServicesPage    from './pages/admin/ServicesPage';
import VideosPage      from './pages/admin/VideosPage';
import ReviewsPage     from './pages/admin/ReviewsPage';
import HeroPage        from './pages/admin/HeroPage';
import AboutPage       from './pages/admin/AboutPage';
import SettingsPage    from './pages/admin/SettingsPage';

function PublicSite() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <VideosSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <footer style={{
        background: 'var(--color-navy)',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        padding: '24px',
        fontSize: '0.9rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        © {new Date().getFullYear()} Gebze Direksiyon Eğitimi. Tüm hakları saklıdır.
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicSite />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin protected */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index         element={<DashboardPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="videos"   element={<VideosPage />} />
          <Route path="reviews"  element={<ReviewsPage />} />
          <Route path="hero"     element={<HeroPage />} />
          <Route path="about"    element={<AboutPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
