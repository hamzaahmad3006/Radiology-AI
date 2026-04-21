import os
import shutil
from sqlalchemy.orm import Session
from models.scan_model import Scan
from services.ai_service import AIService
from fastapi import UploadFile
import uuid

class ScanController:
    @staticmethod
    def upload_and_analyze(file: UploadFile, db: Session):
        # Save file
        upload_dir = "/tmp/uploads" if os.environ.get("VERCEL") else "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        file_ext = file.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(upload_dir, file_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Analyze image using Vision AI (Supports all X-rays)
        analysis = AIService.analyze_vision(file_path)
        
        # Create DB record
        new_scan = Scan(
            image_path=file_path,
            prediction=f"{analysis['body_part']}: {analysis['prediction']}",
            confidence=analysis["confidence"],
            explanation=analysis["explanation"],
            heatmap_path=None # Vision model doesn't provide heatmap yet
        )
        
        db.add(new_scan)
        db.commit()
        db.refresh(new_scan)
        
        return new_scan

    @staticmethod
    def get_history(db: Session):
        return db.query(Scan).order_by(Scan.created_at.desc()).all()

    @staticmethod
    def chat_with_scan(scan_id: int, question: str, db: Session):
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            return "Scan result not found."
            
        context = {
            "prediction": scan.prediction,
            "confidence": scan.confidence,
            "explanation": scan.explanation
        }
        
        return AIService.chat_assistant(question, context)

    @staticmethod
    def delete_scan(scan_id: int, db: Session):
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            return False
            
        # Delete the image file if it exists
        if os.path.exists(scan.image_path):
            os.remove(scan.image_path)
            
        # Delete database record
        db.delete(scan)
        db.commit()
        return True
