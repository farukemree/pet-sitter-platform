# Authentication Module

Bu modul, kullanici kaydi, giris ve kimlik dogrulama islemlerini yonetir.

## Icerik

- `auth.service.js` - Is mantigi (kullanici kaydi, giris, sifre yonetimi)
- `auth.controller.js` - HTTP isteklerini yoneten controller
- `auth.middleware.js` - JWT token dogrulama middleware'i
- `auth.routes.js` - Route tanimlamalari

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `GET /api/auth/verify`

## Guvenlik Notlari

- Production ortaminda `JWT_SECRET` degerini guclu ve benzersiz bir anahtar ile degistirin.
- API'yi production ortaminda HTTPS uzerinden yayinlayin.
- Bruteforce saldirilarina karsi rate limiting ekleyin.
