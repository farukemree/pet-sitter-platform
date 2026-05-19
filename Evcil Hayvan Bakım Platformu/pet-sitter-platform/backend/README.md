# Pet Sitter Platform Backend

Bu backend, Express + PostgreSQL tabanli API katmanidir.

## Modul Yapisı

- `src/modules/auth` - Kayit, giris, token dogrulama, sifre degistirme
- `src/config/database.js` - PostgreSQL baglanti havuzu
- `src/shared/middlewares` - Yetkilendirme ve hata yonetimi
- `tests/unit/auth.service.test.js` - Auth servis unit testleri

## Hizli Baslangic

```bash
npm install
cp .env.example .env
npm run dev
```

## Auth Endpointleri

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `GET /api/auth/verify`
