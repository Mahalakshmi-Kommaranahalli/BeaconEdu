from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartForm API",
    description="Backend API for SmartForm",
    version="1.0.0",
)

# React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "SmartForm API is running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "SmartForm Backend",
        "database": "SQLite"
    }