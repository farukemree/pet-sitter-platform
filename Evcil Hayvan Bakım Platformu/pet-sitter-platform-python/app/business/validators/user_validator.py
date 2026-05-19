"""
User Validator - Kullanici Validasyon

Kullanici kayit ve giris islemlerinde veri dogrulamasi yapar.
"""

import re

from app.shared.exceptions import ValidationError


class UserValidator:
    """
    Kullanici validasyon sinifi

    E-posta, sifre, isim ve rol validasyonlarini yapar.
    """

    EMAIL_REGEX = re.compile(
        r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    )
    MIN_PASSWORD_LENGTH = 6
    MIN_NAME_LENGTH = 2
    VALID_ROLES = ["owner", "sitter"]

    def validate_registration(self, name, email, password, role, terms_accepted):
        errors = []

        if not name or len(name.strip()) < self.MIN_NAME_LENGTH:
            errors.append(
                f"Isim en az {self.MIN_NAME_LENGTH} karakter olmalidir"
            )

        if not email or not self.EMAIL_REGEX.match(email):
            errors.append("Gecerli bir e-posta adresi giriniz")

        if not password or len(password) < self.MIN_PASSWORD_LENGTH:
            errors.append(
                f"Sifre en az {self.MIN_PASSWORD_LENGTH} karakter olmalidir"
            )

        if not role or role not in self.VALID_ROLES:
            errors.append("Gecerli bir rol seciniz (owner veya sitter)")

        if not terms_accepted:
            errors.append("Kullanici sozlesmesini kabul etmelisiniz")

        if errors:
            raise ValidationError(", ".join(errors))

    def validate_email(self, email):
        if not email:
            return False
        return bool(self.EMAIL_REGEX.match(email))

    def validate_password(self, password):
        if not password:
            return False
        return len(password) >= self.MIN_PASSWORD_LENGTH

    def validate_role(self, role):
        return role in self.VALID_ROLES
