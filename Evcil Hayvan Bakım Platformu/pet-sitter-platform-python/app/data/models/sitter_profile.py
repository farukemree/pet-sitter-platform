"""
SitterProfile Model - Bakıcı Profili Modeli

Dokümandaki sitter_profiles tablosu için SQLAlchemy ORM modeli.
Bakıcı rolündeki kullanıcıların profil bilgilerini içerir.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.data.database import Base


class SitterProfile(Base):
    """
    SitterProfile Modeli - sitter_profiles tablosu

    Bakıcı kullanıcıların profil bilgilerini içerir.
    User tablosu ile 1-1 ilişkilidir (bir kullanıcının bir profili olabilir).
    """

    __tablename__ = "sitter_profiles"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="Profil ID"
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
        comment="İlişkili kullanıcı ID"
    )

    location = Column(
        String(200),
        nullable=False,
        index=True,
        comment="Bakıcının lokasyonu (şehir, semt)"
    )

    service_type = Column(
        String(100),
        nullable=False,
        comment="Hizmet türü (örn: günlük bakım, evde bakım, yürüyüş)"
    )

    daily_rate = Column(
        Numeric(10, 2),
        nullable=False,
        comment="Günlük ücret beklentisi (TL)"
    )

    bio = Column(
        Text,
        nullable=True,
        comment="Kısa özgeçmiş, tanıtım yazısı"
    )

    experience = Column(
        Text,
        nullable=True,
        comment="Deneyim bilgisi, önceki işler, sertifikalar"
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
        comment="Profil aktif mi? (listelerde gösterilsin mi?)"
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        comment="Profil oluşturma tarihi"
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        comment="Son güncelleme tarihi"
    )

    user = relationship(
        "User",
        back_populates="sitter_profile"
    )

    def __repr__(self):
        return f"<SitterProfile(id={self.id}, user_id={self.user_id}, location='{self.location}')>"

    def to_dict(self, include_user=False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "location": self.location,
            "service_type": self.service_type,
            "daily_rate": float(self.daily_rate) if self.daily_rate else None,
            "bio": self.bio,
            "experience": self.experience,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

        if include_user and self.user:
            data["user"] = {
                "id": self.user.id,
                "name": self.user.name,
                "email": self.user.email
            }

        return data

    @property
    def is_complete(self):
        return all([
            self.location,
            self.service_type,
            self.daily_rate is not None,
            self.daily_rate >= 0
        ])

    def activate(self):
        self.is_active = True

    def deactivate(self):
        self.is_active = False
