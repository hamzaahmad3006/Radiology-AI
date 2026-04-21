import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.scan_model import Base
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database URL from environment or local SQLite
# Neon URL format: postgresql://user:password@endpoint/dbname?sslmode=require
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

if SQLALCHEMY_DATABASE_URL:
    # Check if it's a postgres URL and handle the 'postgres://' vs 'postgresql://' issue if needed
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # PostgreSQL engine initialization
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    # Fallback to local SQLite
    if os.environ.get("VERCEL"):
        # This shouldn't really be used if Neon is set up, but kept as backup
        SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/radiology_ai.db"
    else:
        SQLALCHEMY_DATABASE_URL = "sqlite:///./radiology_ai.db"
    
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # Import models here to ensure they are registered with Base
    from models.scan_model import Scan
    from models.user_model import User
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
