from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from controllers.scan_controller import ScanController

router = APIRouter()

@router.post("/upload-xray")
async def upload_xray(file: UploadFile = File(...), db: Session = Depends(get_db)):
    return ScanController.upload_and_analyze(file, db)

@router.get("/scan-history")
async def scan_history(db: Session = Depends(get_db)):
    return ScanController.get_history(db)

@router.delete("/scan/{scan_id}")
async def delete_scan(scan_id: int, db: Session = Depends(get_db)):
    success = ScanController.delete_scan(scan_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"message": "Scan deleted successfully"}
