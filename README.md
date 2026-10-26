# 🚗 Gebze Direksiyon Eğitimi - Web Uygulaması

Bu proje, **Gebze Direksiyon Eğitimi (Sedat Hoca)** için geliştirilmiş modern, tam donanımlı ve SEO uyumlu web uygulaması ve yönetim panelidir.

---

## 🛠️ Teknoloji Yığını

- **Frontend:** React 19, Vite, React Router DOM, Axios, Vanilla CSS (Modern UI/UX, Glassmorphism, Micro-animations)
- **Backend:** Laravel 12 (PHP 8.2+), Laravel Sanctum (Token Auth), RESTful API
- **Veritabanı:** SQLite (veya MySQL/PostgreSQL desteği)
- **Sunucu & Dağıtım:** Docker, Nginx, Coolify (Ubuntu VPS)

---

## 📂 Proje Yapısı

```
gebze-direksiyon/
├── backend/                   # Laravel 12 API
│   ├── app/                   # Controllers, Models, Middleware
│   ├── config/                # Laravel Konfigürasyonları (CORS, Sanctum vb.)
│   ├── database/              # Migrations, Seeders
│   ├── docker/                # Nginx, Supervisor, Entrypoint scriptleri
│   ├── routes/                # api.php, web.php
│   ├── storage/               # Yüklenen medya dosyaları (public/storage)
│   ├── .env.example           # Örnek çevre değişkenleri
│   └── Dockerfile             # Production PHP 8.2 + Nginx container
├── frontend/                  # React + Vite SPA
│   ├── src/                   # Sayfalar, Bileşenler, API istemcisi
│   ├── public/                # Statik varlıklar, favicon, resimler
│   ├── nginx.conf             # SPA routing (HTML5 history mode) Nginx config
│   ├── .env.example           # Örnek çevre değişkenleri
│   └── Dockerfile             # Multi-stage production Nginx container
├── docker-compose.yml         # Coolify & Yerel Docker orkestrasyonu
└── .gitignore                 # Temiz ve güvenli repo kuralları
```

---

## 🚀 Coolify (Ubuntu VPS) Kurulum Rehberi

Coolify üzerinde projeyi **2 farklı yöntemle** yayınlayabilirsiniz:

### 🌟 Yöntem 1: Docker Compose ile Dağıtım (En Kolay & Önerilen)

1. **Coolify Paneline Giriş Yapın** ve projenize gidin.
2. **+ New Resource** > **Git Repository** (GitHub) seçin.
3. Reponuzu (`gebze-direksiyon`) seçin ve **Branch** olarak `main` belirleyin.
4. Build Pack olarak **Docker Compose** seçin.
5. **Environment Variables** bölümüne şunları ekleyin:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:Mbz+H2HJs/PEzPmM95i79h+qMTh/R7RneOzW09ugMoo=
   BACKEND_URL=https://api.gebzedireksiyonegitimi.com
   DB_CONNECTION=sqlite
   RUN_MIGRATIONS=true
   VITE_API_URL=https://api.gebzedireksiyonegitimi.com/api
   VITE_STORAGE_URL=https://api.gebzedireksiyonegitimi.com/storage
   ```
6. **Domains (Alan Adları):**
   - Frontend servisi için: `https://gebzedireksiyonegitimi.com`
   - Backend servisi için: `https://api.gebzedireksiyonegitimi.com`
7. **Deploy** butonuna basın. Coolify SSL sertifikalarını (Let's Encrypt) otomatik oluşturur ve projeyi yayına alır.

---

### 📦 Yöntem 2: Ayrı Servisler Olarak Dağıtım (Monorepo)

Coolify'da aynı depoyu 2 ayrı servis olarak ekleyebilirsiniz:

#### 1. Backend Servisi (Laravel API)
- **Base Directory:** `/backend`
- **Build Pack:** `Dockerfile`
- **Port Expose:** `80`
- **Domains:** `https://api.gebzedireksiyonegitimi.com`
- **Persistent Storage (Kalıcı Disk):**
  - `/var/www/html/storage/app/public`
  - `/var/www/html/database` (SQLite için)

#### 2. Frontend Servisi (React SPA)
- **Base Directory:** `/frontend`
- **Build Pack:** `Dockerfile`
- **Port Expose:** `80`
- **Domains:** `https://gebzedireksiyonegitimi.com`
- **Build Arguments:**
  - `VITE_API_URL=https://api.gebzedireksiyonegitimi.com/api`
  - `VITE_STORAGE_URL=https://api.gebzedireksiyonegitimi.com/storage`

---

## 💾 Mevcut Hosting'deki Verileri Aktarma (Migration)

Şu anki hostinginizdeki canlı verileri yeni sunucuya taşımak için:

1. **Veritabanı Dosyası:**
   - Eski hostinginizdeki `backend/database/database.sqlite` dosyasını indirin.
   - Coolify'da backend container'ının persistent volume dizinine kopyalayın (`/var/www/html/database/database.sqlite`).
2. **Yüklenen Medyalar (Resim/Video):**
   - Eski hostinginizdeki `storage/app/public` klasörünün içeriğini indirin.
   - Coolify'daki backend persistent volume dizinine (`/var/www/html/storage/app/public`) aktarın.
3. **İlk Kurulum Seeder'ı (Gerekirse):**
   - Eğer sıfırdan veri oluşturmak isterseniz:
     ```bash
     php artisan db:seed --force
     ```
   - Varsayılan Yönetici: `admin@gebzedireksiyonegitimi.com` / `admin123`

---

## 💻 Yerel Geliştirme (Local Development)

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Güvenlik Notları
- `.env` dosyaları, SQLite veritabanı dosyaları ve yedek zip arşivleri `.gitignore` ile korunmaktadır.
- GitHub'a hiçbir zaman hassas şifreler yüklenmez. Tüm ortam değişkenleri Coolify arayüzünden tanımlanır.
