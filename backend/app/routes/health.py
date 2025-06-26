from fastapi import APIRouter

router = APIRouter(tags=["health"])

@router.get("/health")
def health_check():
    """Health check endpoint for Docker and monitoring"""
    return {"status": "healthy", "service": "lexibox-backend"} 