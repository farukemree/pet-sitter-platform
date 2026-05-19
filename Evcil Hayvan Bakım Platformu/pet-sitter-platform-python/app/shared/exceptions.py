"""
Custom Exceptions - Ozel Hata Siniflari

Uygulamaya ozel hata siniflari tanimlanir.
"""


class BaseApplicationError(Exception):
    """
    Temel uygulama hatasi

    Tum ozel hatalar bu siniftan turetilir.
    """

    def __init__(self, message, status_code=500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ValidationError(BaseApplicationError):
    """
    Validasyon hatasi

    Form veya veri dogrulama hatalarinda kullanilir.
    """

    def __init__(self, message):
        super().__init__(message, status_code=400)


class AuthenticationError(BaseApplicationError):
    """
    Kimlik dogrulama hatasi

    Giris basarisiz oldugunda veya token gecersiz oldugunda kullanilir.
    """

    def __init__(self, message):
        super().__init__(message, status_code=401)


class AuthorizationError(BaseApplicationError):
    """
    Yetkilendirme hatasi

    Kullanicinin yetkisi olmayan bir islemi yapmaya calistiginda kullanilir.
    """

    def __init__(self, message):
        super().__init__(message, status_code=403)


class NotFoundError(BaseApplicationError):
    """
    Kayit bulunamadi hatasi

    Aranan kayit veritabaninda bulunamadiginda kullanilir.
    """

    def __init__(self, message):
        super().__init__(message, status_code=404)


class DuplicateEmailError(BaseApplicationError):
    """
    E-posta benzersizlik hatasi

    Ayni e-posta adresi ile kayit yapmaya calisildiginda kullanilir.
    """

    def __init__(self, message):
        super().__init__(message, status_code=409)


class DatabaseError(BaseApplicationError):
    """
    Veritabani hatasi

    Veritabani islemlerinde olusan genel hatalar icin kullanilir.
    """

    def __init__(self, message):
        super().__init__(message, status_code=500)
