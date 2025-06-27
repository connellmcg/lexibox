from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Organization, UserInvitation
from ..schemas.organization import OrganizationResponse, UserInvitationCreate, UserInvitationResponse
from ..schemas.user import UserResponse
from ..auth import get_current_user

router = APIRouter(prefix="/org", tags=["organization"])

def require_org_admin(current_user: User = Depends(get_current_user)):
    if not current_user.organization_id or not current_user.is_org_admin:
        raise HTTPException(status_code=403, detail="Org admin privileges required")
    return current_user

@router.get("/me", response_model=OrganizationResponse)
def get_my_org(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.organization_id:
        raise HTTPException(status_code=404, detail="User is not part of an organization")
    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.get("/users", response_model=List[UserResponse])
def list_org_users(current_user: User = Depends(require_org_admin), db: Session = Depends(get_db)):
    users = db.query(User).filter(User.organization_id == current_user.organization_id).all()
    return users

@router.post("/invite", response_model=UserInvitationResponse)
def invite_user(invite: UserInvitationCreate, current_user: User = Depends(require_org_admin), db: Session = Depends(get_db)):
    # Only allow inviting to your own org
    if invite.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Can only invite to your own organization")
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == invite.email, User.organization_id == invite.organization_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists in this organization")
    # Check if invitation already exists
    existing_invite = db.query(UserInvitation).filter(UserInvitation.email == invite.email, UserInvitation.organization_id == invite.organization_id, UserInvitation.accepted == False).first()
    if existing_invite:
        raise HTTPException(status_code=400, detail="Invitation already sent to this email")
    # Create invitation
    new_invite = UserInvitation(
        email=invite.email,
        organization_id=invite.organization_id,
        invited_by_user_id=current_user.id
    )
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)
    # (Optional: send email here)
    return new_invite

@router.get("/invites", response_model=List[UserInvitationResponse])
def list_org_invites(current_user: User = Depends(require_org_admin), db: Session = Depends(get_db)):
    invites = db.query(UserInvitation).filter(UserInvitation.organization_id == current_user.organization_id, UserInvitation.accepted == False).all()
    return invites

@router.post("/accept-invite/{invite_id}", response_model=UserResponse)
def accept_invite(invite_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    invite = db.query(UserInvitation).filter(UserInvitation.id == invite_id, UserInvitation.email == current_user.email, UserInvitation.accepted == False).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Invitation not found or already accepted")
    # Accept invitation
    invite.accepted = True
    from datetime import datetime
    invite.accepted_at = datetime.utcnow()
    # Add user to org
    current_user.organization_id = invite.organization_id
    current_user.is_org_admin = False
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/users/{user_id}")
def remove_user(user_id: int, current_user: User = Depends(require_org_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.organization_id == current_user.organization_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in your organization")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
    db.delete(user)
    db.commit()
    return {"message": f"User {user.email} removed from organization"}

@router.put("/users/{user_id}/admin")
def toggle_org_admin(user_id: int, current_user: User = Depends(require_org_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.organization_id == current_user.organization_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in your organization")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot change your own admin status")
    user.is_org_admin = not user.is_org_admin
    db.commit()
    db.refresh(user)
    return {"message": f"Org admin status {'enabled' if user.is_org_admin else 'disabled'} for user {user.email}", "user": user} 