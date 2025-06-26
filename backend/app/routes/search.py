from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from ..database import get_db
from ..models import Document, User
from ..schemas.document import DocumentResponse
from ..auth import get_current_user

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/test")
def test_search(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Test endpoint to check if documents exist and have content"""
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    
    result = {
        "user_id": current_user.id,
        "total_documents": len(documents),
        "documents": []
    }
    
    for doc in documents:
        result["documents"].append({
            "id": doc.id,
            "filename": doc.filename,
            "content_length": len(doc.content) if doc.content else 0,
            "content_preview": doc.content[:200] if doc.content else "No content"
        })
    
    return result

@router.get("/", response_model=List[DocumentResponse])
def search_documents(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Debug: Print search query and user info
    print(f"=== SEARCH DEBUG ===")
    print(f"Search query: '{q}'")
    print(f"Searching for user: {current_user.id}")
    
    # First, get all documents for the user to debug
    all_docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    print(f"User has {len(all_docs)} total documents in database:")
    for doc in all_docs:
        print(f"  - ID: {doc.id}, Filename: {doc.filename}")
    
    # Search in documents belonging to the current user
    # Use case-insensitive search and search in both filename and content
    documents = db.query(Document).filter(
        Document.user_id == current_user.id,
        or_(
            Document.content.ilike(f"%{q}%"),
            Document.filename.ilike(f"%{q}%")
        )
    ).all()
    
    # Debug: Print results
    print(f"Found {len(documents)} matching documents:")
    for doc in documents:
        print(f"  - Match: {doc.filename} (ID: {doc.id})")
    print(f"=== END SEARCH DEBUG ===")
    
    return [
        DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            content=doc.content,
            upload_date=doc.upload_date
        ) for doc in documents
    ] 