"""
User Repository - Kullanici Veri Erisim Katmani

User tablosu icin CRUD islemlerini icerir.
Repository Pattern kullanilarak is mantigi katmani SQL detaylarindan izole edilir.
"""

from sqlalchemy.orm import Session

from app.data.database import db_session
from app.data.models.user import User


class UserRepository:
    """
    Kullanici repository

    User tablosu uzerinde veritabani islemlerini yonetir.
    """

    def __init__(self, session: Session = None):
        self.session = session or db_session

    def create(
        self, name, email, password_hash, role, terms_accepted, is_active=True
    ):
        user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            role=role,
            terms_accepted=terms_accepted,
            is_active=is_active,
        )

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user

    def find_by_id(self, user_id):
        return self.session.query(User).filter(User.id == user_id).first()

    def find_by_email(self, email):
        return (
            self.session.query(User)
            .filter(User.email == email.lower())
            .first()
        )

    def find_all(self, skip=0, limit=100):
        return self.session.query(User).offset(skip).limit(limit).all()

    def find_by_role(self, role, skip=0, limit=100):
        return (
            self.session.query(User)
            .filter(User.role == role)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(self, user):
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete(self, user):
        self.session.delete(user)
        self.session.commit()

    def count_by_role(self, role):
        return self.session.query(User).filter(User.role == role).count()
