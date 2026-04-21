from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    explanation = Column(String)
    heatmap_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
