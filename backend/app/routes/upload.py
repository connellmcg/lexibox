from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Document, User
from ..schemas.document import DocumentResponse
from ..services.pdf_service import extract_text_from_pdf
from ..auth import get_current_user
import os
from datetime import datetime

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/", response_model=DocumentResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Save file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    try:
        # Extract text from PDF
        extracted_text = extract_text_from_pdf(file_path)
        
        # Save to database
        db_document = Document(
            filename=file.filename,
            file_path=file_path,
            content=extracted_text,
            upload_date=datetime.utcnow(),
            user_id=current_user.id
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        return DocumentResponse(
            id=db_document.id,
            filename=db_document.filename,
            content=db_document.content,
            upload_date=db_document.upload_date
        )
        
    except Exception as e:
        # Clean up file if processing fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}") 