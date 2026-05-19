"""
Message Model - Mesaj Modeli

Dokümandaki messages tablosu için SQLAlchemy ORM modeli.
Kullanıcılar arasında gönderilen mesajları içerir.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Text, Boolean, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from app.data.database import Base


class Message(Base):
    """
    Message Modeli - messages tablosu

    Bir konuşma (conversation) içerisinde gönderilen mesajları temsil eder.
    Her mesaj bir gönderen (sender) ve bir konuşma (conversation) ile ilişkilidir.
    """

    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="Mesaj ID"
    )

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="İlişkili konuşma ID"
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Mesajı gönderen kullanıcı ID"
    )

    content = Column(
        Text,
        nullable=False,
        comment="Mesaj içeriği"
    )

    is_read = Column(
        Boolean,
        nullable=False,
        default=False,
        comment="Mesaj okundu mu?"
    )

    sent_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True,
        comment="Mesaj gönderim tarihi"
    )

    __table_args__ = (
        CheckConstraint(
            "LENGTH(content) > 0",
            name="chk_content_not_empty"
        ),
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )

    sender = relationship(
        "User",
        back_populates="sent_messages"
    )

    def __repr__(self):
        content_preview = self.content[:30] + "..." if len(self.content) > 30 else self.content
        return f"<Message(id={self.id}, sender_id={self.sender_id}, content='{content_preview}')>"

    def to_dict(self, include_sender=False, include_conversation=False):
        data = {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "sender_id": self.sender_id,
            "content": self.content,
            "is_read": self.is_read,
            "sent_at": self.sent_at.isoformat() if self.sent_at else None
        }

        if include_sender and self.sender:
            data["sender"] = {
                "id": self.sender.id,
                "name": self.sender.name,
                "email": self.sender.email
            }

        if include_conversation and self.conversation:
            data["conversation"] = {
                "id": self.conversation.id,
                "owner_id": self.conversation.owner_id,
                "sitter_id": self.conversation.sitter_id
            }

        return data

    def mark_as_read(self):
        self.is_read = True

    def mark_as_unread(self):
        self.is_read = False

    @property
    def is_unread(self):
        return not self.is_read

    def can_be_read_by(self, user_id):
        if not self.conversation:
            return False

        return user_id in [
            self.conversation.owner_id,
            self.conversation.sitter_id
        ]

    def is_sent_by(self, user_id):
        return self.sender_id == user_id
