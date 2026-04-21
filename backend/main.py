from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import scan_routes, chat_routes, auth_routes
from models import user_model
from database import init_db
import os

# Initialize database
init_db()

app = FastAPI(
    title="RadiologyAI Assistant API",
    root_path="/api" if os.environ.get("VERCEL") else ""
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use /tmp/uploads on Vercel (read-only filesystem), local path otherwise
UPLOAD_DIR = "/tmp/uploads" if os.environ.get("VERCEL") else "uploads"

# Create uploads directory if not exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Register routes
app.include_router(scan_routes.router)
app.include_router(chat_routes.router)
app.include_router(auth_routes.router)

@app.get("/")
async def root():
    return {"message": "Welcome to RadiologyAI Assistant API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
