"""
Conversation Model - Konuşma Modeli

Dokümandaki conversations tablosu için SQLAlchemy ORM modeli.
İki kullanıcı (owner ve sitter) arasındaki mesajlaşma oturumunu temsil eder.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

from app.data.database import Base


class Conversation(Base):
    """
    Conversation Modeli - conversations tablosu

    İki kullanıcı arasındaki konuşma oturumunu temsil eder.
    Bir owner (evcil hayvan sahibi) ile bir sitter (bakıcı) arasında
    sadece bir konuşma olabilir.
    """

    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="Konuşma ID"
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Konuşmayı başlatan kullanıcı (owner) ID"
    )

    sitter_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Mesaj alan bakıcı (sitter) ID"
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        comment="Konuşma başlama tarihi"
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        comment="Son mesaj tarihi (güncelleme)"
    )

    __table_args__ = (
        UniqueConstraint(
            'owner_id',
            'sitter_id',
            name='uq_conversation'
        ),
        CheckConstraint(
            'owner_id != sitter_id',
            name='chk_no_self_conversation'
        ),
    )

    owner = relationship(
        "User",
        foreign_keys=[owner_id],
        back_populates="conversations_as_owner"
    )

    sitter = relationship(
        "User",
        foreign_keys=[sitter_id],
        back_populates="conversations_as_sitter"
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.sent_at"
    )

    def __repr__(self):
        return f"<Conversation(id={self.id}, owner_id={self.owner_id}, sitter_id={self.sitter_id})>"

    def to_dict(self, include_users=False, include_messages=False):
        data = {
            "id": self.id,
            "owner_id": self.owner_id,
            "sitter_id": self.sitter_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

        if include_users:
            if self.owner:
                data["owner"] = {
                    "id": self.owner.id,
                    "name": self.owner.name,
                    "email": self.owner.email
                }
            if self.sitter:
                data["sitter"] = {
                    "id": self.sitter.id,
                    "name": self.sitter.name,
                    "email": self.sitter.email
                }

        if include_messages and self.messages:
            data["messages"] = [msg.to_dict() for msg in self.messages]
            data["message_count"] = len(self.messages)

        return data

    def get_last_message(self):
        if self.messages:
            return self.messages[-1]
        return None

    def get_participant(self, current_user_id):
        if current_user_id == self.owner_id:
            return self.sitter
        if current_user_id == self.sitter_id:
            return self.owner
        return None

    def is_participant(self, user_id):
        return user_id in [self.owner_id, self.sitter_id]
