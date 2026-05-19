"""
Database Configuration

SQLAlchemy veritabanı bağlantısı ve session yönetimi.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "pet_sitter_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

db_session = scoped_session(SessionLocal)

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    """
    Veritabanı tablolarını oluşturur.
    Tüm modeller import edildikten sonra çağrılmalıdır.
    """
    from app.data.models import User, SitterProfile, Conversation, Message  # noqa: F401

    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")


def get_db():
    """
    Database session dependency.

    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def close_db():
    """
    Tüm veritabanı bağlantılarını kapat
    """
    db_session.remove()
    engine.dispose()
    print("Database connections closed")
