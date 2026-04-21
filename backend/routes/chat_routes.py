from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from controllers.scan_controller import ScanController
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    scan_id: int
    question: str

@router.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    response = ScanController.chat_with_scan(request.scan_id, request.question, db)
    return {"response": response}
