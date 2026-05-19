"""
User Model - Kullanıcı Modeli

Dokümandaki users tablosu için SQLAlchemy ORM modeli.
Hem evcil hayvan sahiplerini hem de bakıcıları temsil eder.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
import enum

from app.data.database import Base


class UserRole(enum.Enum):
    """Kullanıcı rolleri enum"""
    OWNER = "owner"    # Evcil hayvan sahibi
    SITTER = "sitter"  # Bakıcı


class User(Base):
    """
    User Modeli - users tablosu

    Sistemdeki tüm kullanıcıların temel bilgilerini içerir.
    Rol alanı sayesinde owner (evcil hayvan sahibi) ve sitter (bakıcı)
    kullanıcıları ayırt edilir.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="Kullanıcı ID")

    name = Column(
        String(100),
        nullable=False,
        comment="Kullanıcının adı soyadı"
    )

    email = Column(
        String(150),
        nullable=False,
        unique=True,
        index=True,
        comment="E-posta adresi (benzersiz)"
    )

    password_hash = Column(
        String(255),
        nullable=False,
        comment="Hashlenmiş şifre (bcrypt)"
    )

    role = Column(
        Enum(UserRole),
        nullable=False,
        index=True,
        comment="Kullanıcı rolü: owner veya sitter"
    )

    terms_accepted = Column(
        Boolean,
        nullable=False,
        default=False,
        comment="Kullanıcı sözleşmesi kabul edildi mi?"
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
        comment="Hesap aktif mi?"
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        comment="Kayıt tarihi"
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        comment="Son güncelleme tarihi"
    )

    sitter_profile = relationship(
        "SitterProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    conversations_as_owner = relationship(
        "Conversation",
        foreign_keys="Conversation.owner_id",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    conversations_as_sitter = relationship(
        "Conversation",
        foreign_keys="Conversation.sitter_id",
        back_populates="sitter",
        cascade="all, delete-orphan"
    )

    sent_messages = relationship(
        "Message",
        back_populates="sender",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role.value}')>"

    def to_dict(self, include_sensitive=False):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "terms_accepted": self.terms_accepted,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

        if include_sensitive:
            data["password_hash"] = self.password_hash

        return data

    @property
    def is_owner(self):
        return self.role == UserRole.OWNER

    @property
    def is_sitter(self):
        return self.role == UserRole.SITTER

    def has_profile(self):
        return self.is_sitter and self.sitter_profile is not None
