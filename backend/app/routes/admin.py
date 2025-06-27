from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Document, Organization, UserInvitation
from ..schemas.user import UserResponse
from ..auth import get_current_user
from ..schemas.document import DocumentResponse
from ..schemas.organization import OrganizationResponse

router = APIRouter(prefix="/admin", tags=["admin"])

def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require admin privileges"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return [
        UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            is_admin=user.is_admin,
            is_org_admin=user.is_org_admin,
            organization_id=user.organization_id,
            created_at=user.created_at,
            updated_at=user.updated_at
        ) for user in users
    ]

@router.get("/documents", response_model=List[DocumentResponse])
def get_all_documents(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all documents from all users (admin only)"""
    documents = db.query(Document).all()
    return [
        DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            content=doc.content,
            upload_date=doc.upload_date,
            user_id=doc.user_id
        ) for doc in documents
    ]

@router.get("/stats")
def get_system_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get system statistics (admin only)"""
    total_users = db.query(User).count()
    total_documents = db.query(Document).count()
    admin_users = db.query(User).filter(User.is_admin == True).count()
    
    return {
        "total_users": total_users,
        "total_documents": total_documents,
        "admin_users": admin_users,
        "average_documents_per_user": total_documents / total_users if total_users > 0 else 0
    }

@router.put("/users/{user_id}/admin")
def toggle_admin_status(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Toggle admin status for a user (admin only)"""
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own admin status"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_admin = not user.is_admin
    db.commit()
    db.refresh(user)
    
    return {
        "message": f"Admin status {'enabled' if user.is_admin else 'disabled'} for user {user.email}",
        "user": UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            is_admin=user.is_admin,
            is_org_admin=user.is_org_admin,
            organization_id=user.organization_id,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    }

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete a user and all their documents (admin only)"""
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Delete all user's documents
    db.query(Document).filter(Document.user_id == user_id).delete()
    
    # Delete the user
    db.delete(user)
    db.commit()
    
    return {"message": f"User {user.email} and all their documents have been deleted"}

@router.get("/organizations", response_model=List[OrganizationResponse])
def get_all_organizations(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all organizations (admin only)"""
    orgs = db.query(Organization).all()
    org_responses = []
    for org in orgs:
        owner = db.query(User).filter(
            User.organization_id == org.id,
            User.is_org_admin == True
        ).order_by(User.created_at).first()
        org_responses.append(
            OrganizationResponse(
                id=org.id,
                name=org.name,
                created_at=org.created_at,
                updated_at=org.updated_at,
                owner=owner
            )
        )
    return org_responses

@router.delete("/organizations/{org_id}")
def delete_organization(
    org_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    # Delete all users in the org
    db.query(User).filter(User.organization_id == org_id).delete()
    # Delete all invitations for the org
    db.query(UserInvitation).filter(UserInvitation.organization_id == org_id).delete()
    # Delete the org
    db.delete(org)
    db.commit()
    return {"message": f"Organization {org.name} and all related users/invitations have been deleted"} 