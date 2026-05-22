# 🐾 Pet Sitter Platform

Evcil hayvan sahipleri (**owner**) ile bakıcıları (**sitter**) aynı çatı altında buluşturan; ilan oluşturma, rezervasyon talebi ve uçtan uca mesajlaşma süreçlerini yöneten **tam yığın (full-stack) web uygulaması**.

> Yazılım Mühendisliği Gereksinim ve Gerçekleştirim dersi kapsamında geliştirilmiştir.

---

## 📌 Proje Tanımı

Pet Sitter Platform, kullanıcıların iki farklı rolde kayıt olabildiği bir bakıcı eşleştirme platformudur:

- **🐶 Owner (Evcil Hayvan Sahibi):** Bölgesindeki bakıcıların ilanlarına göz atar, ilgilendiği bakıcıyla mesajlaşır ve belirlediği tarih aralığı için rezervasyon talebi gönderir.
- **🏡 Sitter (Bakıcı):** Profilini oluşturur, ücret ve konum bilgisini içeren ilanlar yayınlar, gelen rezervasyon taleplerini inceleyip kabul veya ret eder.

Tüm kullanıcı eylemleri **JWT tabanlı kimlik doğrulama** ve **rol bazlı yetkilendirme** altyapısı üzerinden korunmaktadır.

---

## ✨ Özellikler

- 🔐 **JWT tabanlı kayıt ve giriş** (owner / sitter rolleri ayrılır)
- 🛡️ **bcrypt** ile şifre hash'leme ve doğrulama
- 👤 **Bakıcı profil yönetimi** (biyografi, deneyim yılı, kabul edilen evcil hayvan türleri)
- 📋 **İlan yayınlama ve listeleme** (sadece sitter rolü ilan açabilir)
- 📅 **Rezervasyon talebi oluşturma**, kabul / ret etme
  - "Kendi ilanına rezervasyon olmaz", "bitiş tarihi başlangıçtan önce olamaz" gibi iş kuralları service katmanında uygulanır
- 💬 **Kullanıcılar arası mesajlaşma**, sohbet listesi, okunmamış mesaj sayacı
- 🧱 **Modüler katmanlı mimari** (Controller / Service / Repository üçlemesi)
- 🐳 **Docker Compose** ile tek komutta PostgreSQL + pgAdmin ortamı

---

## 🧰 Kullanılan Teknolojiler

### Backend
| Teknoloji | Sürüm | Görevi |
|-----------|-------|--------|
| Node.js | ≥ 16 | Çalışma ortamı |
| Express | ^4.18 | Web çatısı |
| PostgreSQL | 15 | Veritabanı |
| pg | ^8.11 | PostgreSQL sürücüsü |
| jsonwebtoken | ^9.0 | JWT üretimi/doğrulama |
| bcrypt | ^5.1 | Şifre hash'leme |
| helmet | ^7.1 | HTTP başlık güvenliği |
| cors | ^2.8 | CORS yönetimi |
| morgan | ^1.10 | İstek loglama |
| dotenv | ^16.3 | Ortam değişkeni yönetimi |

### Frontend
| Teknoloji | Sürüm | Görevi |
|-----------|-------|--------|
| React | ^18.3 | UI kütüphanesi |
| Vite | ^5.2 | Build / dev sunucusu |
| Axios | ^1.16 | HTTP istemcisi |
| ESLint | ^8.57 | Statik kod analizi |

### Test
| Teknoloji | Görevi |
|-----------|--------|
| Jest | Birim test çatısı + coverage |
| Supertest | HTTP/API entegrasyon testleri |

### Altyapı
- **Docker Compose** — Postgres 15 + pgAdmin 4 servisleri

---

## 📁 Klasör Yapısı

```
pet-sitter-platform/
├── backend/
│   ├── src/
│   │   ├── app.js                   # Express uygulaması & route bağlama
│   │   ├── config/
│   │   │   └── database.js          # PostgreSQL bağlantı havuzu
│   │   ├── shared/
│   │   │   └── middlewares/         # auth, errorHandler
│   │   └── modules/                 # Domain bazlı modüller
│   │       ├── auth/                # Kayıt, giriş, JWT
│   │       ├── users/               # Kullanıcı profili
│   │       ├── sitter-profiles/     # Bakıcı profili
│   │       ├── listings/            # İlan yönetimi
│   │       ├── bookings/            # Rezervasyon akışı
│   │       └── messaging/           # Mesajlaşma
│   ├── database/
│   │   └── migrations/              # SQL şema dosyaları
│   ├── tests/
│   │   ├── unit/                    # Service unit testleri
│   │   └── integration/             # Endpoint entegrasyon testleri
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx                 # React giriş noktası
│   │   ├── App.jsx                  # Üst seviye state + yönlendirme
│   │   ├── pages/                   # Sayfa bileşenleri
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SitterListPage.jsx
│   │   │   ├── SitterDetailPage.jsx
│   │   │   ├── ProfileEditPage.jsx
│   │   │   ├── ConversationsPage.jsx
│   │   │   └── MessagesPage.jsx
│   │   ├── components/              # Ortak küçük bileşenler
│   │   ├── services/                # Axios tabanlı API çağrıları
│   │   └── context/
│   └── package.json
└── docker-compose.yml               # Postgres + pgAdmin
```

Her domain modülü tutarlı bir **4 dosyalık yapı** kullanır:
```
modules/<domain>/
  <domain>.controller.js    → HTTP isteği/cevabı
  <domain>.service.js       → İş kuralları (HTTP/SQL bilmez)
  <domain>.repository.js    → SQL sorguları (PostgreSQL)
  <domain>.routes.js        → URL eşlemesi
```

---

## 🚀 Kurulum Adımları

### Gereksinimler
- **Node.js** ≥ 16, **npm** ≥ 8
- **Docker Desktop** (PostgreSQL için, önerilir) **veya** yerel PostgreSQL ≥ 13

### 1) Repo'yu klonla

```bash
git clone https://github.com/<kullanici-adi>/pet-sitter-platform.git
cd pet-sitter-platform
```

### 2) Veritabanını ayağa kaldır

Docker ile:

```bash
docker-compose up -d
```

Bu komut iki konteyner başlatır:
- **Postgres 15** → `localhost:5432`, kullanıcı: `postgres`, şifre: `password123`, veritabanı: `pet_sitter_db`
- **pgAdmin 4** → `http://localhost:5050` (e-posta: `admin@admin.com`, şifre: `password123`)

### 3) Backend kurulumu

```bash
cd backend
npm install
```

`backend/.env` dosyasını oluştur:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password123
DB_NAME=pet_sitter_db

JWT_SECRET=lutfen-bu-degeri-uretimde-degistirin
JWT_EXPIRES_IN=24h
```

Veritabanı şemasını kur:

```bash
npm run migrate
```

Sunucuyu başlat:

```bash
npm run dev          # nodemon ile (geliştirme)
# veya
npm start            # üretim modu
```

Backend `http://localhost:5000` üzerinde çalışacak. Sağlık kontrolü:

```bash
curl http://localhost:5000/health
# → { "success": true, "message": "Server is running", "timestamp": "..." }
```

### 4) Frontend kurulumu

Yeni bir terminalde:

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5174` üzerinde açılacak.

---

## 🖥️ Kullanım

1. Tarayıcıdan `http://localhost:5174` adresine git.
2. **Kayıt Ol** ekranından bir hesap oluştur (`owner` veya `sitter` rolünü seç).
3. **Sitter** isen:
   - Profilini oluştur (biyografi, deneyim, kabul edilen evcil hayvan türleri).
   - "İlan Oluştur" ile bakım ilanı yayınla.
   - "Gelen Talepler" sekmesinden rezervasyon taleplerini incele, kabul/ret et.
4. **Owner** isen:
   - "Bakıcıları Listele" ile aktif ilanları gör.
   - Bir ilana tıkla, detayını incele.
   - "Rezervasyon Talebi Oluştur" ile tarih ve evcil hayvan bilgisi gönder.
   - "Sohbetlerim" üzerinden bakıcıyla mesajlaş.

---

## 🔌 API Uç Noktaları

Tüm endpoint'ler `Content-Type: application/json` ile çalışır. Korumalı uç noktalar `Authorization: Bearer <token>` başlığı ister.

### 🔐 Auth — `/api/auth`
| Yöntem | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| POST | `/register` | Public | Yeni kullanıcı kaydı (owner/sitter) |
| POST | `/login` | Public | Giriş, JWT döner |
| POST | `/logout` | Private | Çıkış |
| GET | `/me` | Private | Aktif kullanıcı profili |
| GET | `/verify` | Private | Token geçerliliği |
| POST | `/change-password` | Private | Şifre değiştirme |

### 👤 Users — `/api/users`
| Yöntem | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| GET | `/profile` | Private | Kendi profilini getir |
| PUT | `/profile` | Private | Profil bilgilerini güncelle |

### 🏡 Sitter Profiles — `/api/sitter-profiles`
| Yöntem | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| GET | `/me` | Private (sitter) | Bakıcı profilini getir |
| PUT | `/me` | Private (sitter) | Bakıcı profilini güncelle/oluştur |

### 📋 Listings — `/api/listings`
| Yöntem | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| GET | `/` | Public | Tüm aktif ilanları listele |
| POST | `/` | Private (sitter) | Yeni ilan yayınla |

### 📅 Bookings — `/api/bookings`
| Yöntem | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| POST | `/` | Private (owner) | Rezervasyon talebi oluştur |
| GET | `/my` | Private | Kendi rezervasyonların (role'e göre) |
| PATCH | `/:id/status` | Private (sitter) | Rezervasyonu kabul/ret et |

### 💬 Messaging — `/api/messaging`
| Yöntem | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| POST | `/send` | Private | Mesaj gönder |
| GET | `/conversations` | Private | Sohbet listesi (okunmamış sayısıyla) |
| GET | `/history/:partnerId` | Private | Belirli bir kullanıcıyla geçmiş |

### 🩺 Health
| Yöntem | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| GET | `/health` | Public | Sunucu canlı mı kontrolü |

---

## 🧪 Test

### Backend — Jest + Supertest

```bash
cd backend
npm test              # Jest --coverage ile çalışır
```

Çıktı `coverage/` klasörü altında HTML rapor üretir.

### Frontend — ESLint

```bash
cd frontend
npm run lint          # Tüm .js/.jsx dosyalarını analiz eder
```

ESLint, React Hooks kurallarını ve kullanılmayan değişkenleri raporlar.

---

## 🗄️ Veritabanı Şeması (Özet)

```
users (id, name, email, password_hash, role, terms_accepted, is_active, ...)
  └─ sitter_profiles (user_id → users.id, bio, experience_years, pet_types_allowed)
  └─ listings (sitter_id → users.id, title, description, price_per_day, location)
       └─ bookings (listing_id, owner_id, sitter_id, start_date, end_date,
                    pet_name, pet_type, note, status)
  └─ messages (sender_id, receiver_id, content, is_read, created_at)
```

`bookings.status` değerleri: `pending` · `accepted` · `rejected` · `cancelled` · `completed`

`users.role` değerleri: `owner` · `sitter`

---

## 🤝 Katkı (Contribution)

Katkı sağlamak isteyenler için adımlar:

1. Bu repo'yu **fork** et.
2. Yeni bir feature branch oluştur:
   ```bash
   git checkout -b feature/eklemek-istedigin-ozellik
   ```
3. Değişikliklerini yap; **lint** ve **test**'lerin geçtiğinden emin ol:
   ```bash
   cd backend  && npm test
   cd ../frontend && npm run lint
   ```
4. Açıklayıcı commit mesajları yaz:
   ```
   feat: rezervasyon takvim görünümü eklendi
   fix: login sonrası token kaybı düzeltildi
   docs: README API tablosu güncellendi
   ```
5. **Pull Request** aç ve açıklamasında neyi neden değiştirdiğini özetle.

### Geliştirme Kuralları
- Yeni bir domain eklerken modüler yapıyı koru: `controller / service / repository / routes`
- İş kurallarını **service** katmanına yaz, controller'ı ince tut.
- SQL yalnızca **repository** içinde olsun.
- Türkçe hata mesajları için tutarlı tonu koru (kullanıcıya gösterilen mesajlar Türkçe).

---

## 🔒 Güvenlik Notları

- `JWT_SECRET` mutlaka **`.env`** üzerinden gelmeli ve üretimde rastgele uzun bir değer olmalı.
- Production'a çıkmadan önce:
  - `cors({ origin: true })` yerine **whitelist** bir origin listesi tanımla.
  - `docker-compose.yml`'deki varsayılan parolaları değiştir.
  - `helmet` zaten aktif; ek olarak rate-limiting (örn. `express-rate-limit`) önerilir.

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile yayınlanmıştır. Detaylar için `LICENSE` dosyasına bakınız.

---
