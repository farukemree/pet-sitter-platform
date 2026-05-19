# Pet Sitter Platform (Python/Flask)

Bu proje, Evcil Hayvan Bakıcı Platformu'nun Python Flask tabanlı sürümü için temel iskelet ve veritabanı model katmanını içerir.

## Durum

- Katmanlı klasör yapısı oluşturuldu.
- `app/data/models` altında temel SQLAlchemy modelleri eklendi.
- `app/data/database.py` ile veritabanı bağlantı/session altyapısı eklendi.
- Authentication modülü eklendi: `AuthService`, `UserRepository`, `UserValidator`, `JWTHandler`, `AuthController`, HTML + JSON route'ları, `templates/auth` ve `templates/layouts`.

## Calistirma

```bash
python run.py
```

### Auth endpoints

- Sayfalar: `GET/POST /auth/register`, `GET/POST /auth/login`, `GET /auth/logout`
- API (JSON): `POST /api/auth/register`, `POST /api/auth/login`

Profil ve listeleme yonlendirmeleri icin stub blueprint'ler: `/profile/create`, `/profile/`, `/listings/sitters`.

## Kurulum

```bash
python -m venv venv
source venv/bin/activate
```

Windows PowerShell:

```powershell
python -m venv venv
venv\\Scripts\\Activate.ps1
```

Bağımlılıkları yükle:

```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

## Environment

`.env.example` dosyasını `.env` olarak kopyalayıp düzenleyin:

```bash
cp .env.example .env
```

## Sonraki Adim

Profil, liste ve mesajlasma katmanlari; Alembic migrasyonlari; JWT korumali API middleware.
