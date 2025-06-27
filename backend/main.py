from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base, Document, User
from app.routes import documents_router, search_router, upload_router, auth_router, admin_router, organization_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LexiBox API",
    description="PDF Text Extraction and Search API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(documents_router)
app.include_router(search_router)
app.include_router(admin_router)
app.include_router(organization_router)

@app.get("/")
async def root():
    return {"message": "Welcome to LexiBox API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 