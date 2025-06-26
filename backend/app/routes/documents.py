from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Document, User
from ..schemas.document import DocumentResponse
from ..auth import get_current_user

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    
    # Debug: Print document count and content preview
    print(f"User {current_user.id} has {len(documents)} documents")
    for doc in documents:
        content_preview = doc.content[:100] if doc.content else "No content"
        print(f"Document {doc.id}: {doc.filename} - Content preview: {content_preview}")
    
    return [
        DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            content=doc.content,
            upload_date=doc.upload_date
        ) for doc in documents
    ]

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return DocumentResponse(
        id=document.id,
        filename=document.filename,
        content=document.content,
        upload_date=document.upload_date
    )

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"=== DELETE DEBUG ===")
    print(f"Attempting to delete document ID: {document_id} for user: {current_user.id}")
    
    try:
        document = db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        ).first()
        
        if not document:
            print(f"Document {document_id} not found for user {current_user.id}")
            print(f"=== END DELETE DEBUG ===")
            raise HTTPException(status_code=404, detail="Document not found")
        
        print(f"Found document: {document.filename} (ID: {document.id})")
        
        # Check how many documents user has before deletion
        docs_before = db.query(Document).filter(Document.user_id == current_user.id).count()
        print(f"User has {docs_before} documents before deletion")
        
        # Delete the document
        db.delete(document)
        
        # Commit the transaction
        db.commit()
        
        # Verify the deletion by checking the database again
        deleted_doc = db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        ).first()
        
        if deleted_doc:
            print(f"ERROR: Document {document_id} still exists after deletion!")
            print(f"=== END DELETE DEBUG ===")
            raise HTTPException(status_code=500, detail="Failed to delete document")
        
        # Check how many documents user has after deletion
        docs_after = db.query(Document).filter(Document.user_id == current_user.id).count()
        print(f"User has {docs_after} documents after deletion")
        print(f"Document {document_id} successfully deleted")
        print(f"=== END DELETE DEBUG ===")
        
        return {"message": "Document deleted successfully"}
        
    except Exception as e:
        print(f"ERROR during deletion: {str(e)}")
        db.rollback()
        print(f"=== END DELETE DEBUG ===")
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}") 