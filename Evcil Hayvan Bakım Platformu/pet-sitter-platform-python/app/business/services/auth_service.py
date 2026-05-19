"""
Authentication Service - Kimlik Dogrulama Is Mantigi

Bu servis kullanici kayit ve giris islemlerinin is mantigini icerir.
Sifre hashleme, kullanici dogrulama ve oturum yonetimi burada yapilir.
"""

from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from app.business.utils.jwt_handler import JWTHandler
from app.business.validators.user_validator import UserValidator
from app.data.models.user import UserRole
from app.data.repositories.user_repository import UserRepository
from app.shared.exceptions import (
    AuthenticationError,
    DuplicateEmailError,
    ValidationError,
)


class AuthService:
    """
    Kimlik dogrulama servisi

    Kullanici kayit, giris ve oturum yonetimi islemlerini yonetir.
    """

    def __init__(self):
        self.user_repository = UserRepository()
        self.validator = UserValidator()
        self.jwt_handler = JWTHandler()

    def register(self, name, email, password, role, terms_accepted):
        self.validator.validate_registration(
            name=name,
            email=email,
            password=password,
            role=role,
            terms_accepted=terms_accepted,
        )

        existing_user = self.user_repository.find_by_email(email)
        if existing_user:
            raise DuplicateEmailError("Bu e-posta adresi zaten kayitli")

        password_hash = generate_password_hash(password)

        if role == "owner":
            user_role = UserRole.OWNER
        elif role == "sitter":
            user_role = UserRole.SITTER
        else:
            raise ValidationError("Gecersiz rol degeri")

        try:
            user = self.user_repository.create(
                name=name,
                email=email.lower(),
                password_hash=password_hash,
                role=user_role,
                terms_accepted=terms_accepted,
                is_active=True,
            )
        except IntegrityError:
            self.user_repository.session.rollback()
            raise DuplicateEmailError("Bu e-posta adresi zaten kayitli") from None

        token = self.jwt_handler.generate_token(
            user_id=user.id,
            email=user.email,
            role=user.role.value,
        )

        return {"user": user.to_dict(), "token": token}

    def login(self, email, password):
        if not email or not password:
            raise ValidationError("E-posta ve sifre zorunludur")

        user = self.user_repository.find_by_email(email.lower())

        if not user:
            raise AuthenticationError("Gecersiz e-posta veya sifre")

        if not user.is_active:
            raise AuthenticationError("Hesabiniz aktif degil")

        if not user.terms_accepted:
            raise AuthenticationError(
                "Kullanici sozlesmesini kabul etmelisiniz"
            )

        if not check_password_hash(user.password_hash, password):
            raise AuthenticationError("Gecersiz e-posta veya sifre")

        token = self.jwt_handler.generate_token(
            user_id=user.id,
            email=user.email,
            role=user.role.value,
        )

        return {"user": user.to_dict(), "token": token}

    def verify_token(self, token):
        return self.jwt_handler.verify_token(token)

    def get_user_by_id(self, user_id):
        user = self.user_repository.find_by_id(user_id)
        if not user:
            raise ValueError("Kullanici bulunamadi")
        return user
