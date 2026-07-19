from fastapi import FastAPI, HTTPException, Header, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os
from pathlib import Path

from schemas import ResumeData, LoginRequest, LoginResponse, ResumeDataPatch
import config

app = FastAPI(title="Developer Portfolio API Workspace")

# Enable CORS for local development ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development we can allow all or specific local client ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static avatars
app.mount("/static", StaticFiles(directory=str(config.AVATAR_DIR.parent)), name="static")

def get_auth_token(authorization: str = Header(None)):
    """Dependency helper to verify incoming authorization tokens."""
    if not authorization or not config.verify_session_token(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized access. Invalid session token.")
    return authorization

@app.get("/api/resume", response_model=ResumeData)
def get_resume():
    """Fetch current portfolio information."""
    try:
        return config.load_resume_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database load error: {str(e)}")

@app.post("/api/auth/login", response_model=LoginResponse)
def login(req: LoginRequest):
    """Authenticate admin owner password and issue a session token."""
    if req.password == config.ADMIN_PASSWORD:
        return {"token": config.SESSION_TOKEN}
    raise HTTPException(status_code=401, detail="Invalid admin credentials.")

@app.get("/api/auth/verify")
def verify(token: str = Depends(get_auth_token)):
    """Validate current session token status."""
    return {"status": "authenticated"}

@app.put("/api/resume", response_model=ResumeData)
def update_resume(data: ResumeData, token: str = Depends(get_auth_token)):
    """Save updated portfolio information (requires admin session token)."""
    try:
        config.save_resume_data(data.dict())
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database save error: {str(e)}")

@app.patch("/api/resume")
def patch_resume(data: ResumeDataPatch, token: str = Depends(get_auth_token)):
    """Partially update portfolio fields (requires admin session token)."""
    try:
        update_dict = data.dict(exclude_unset=True)
        config.patch_resume_data(update_dict)
        return {"status": "success", "updated": list(update_dict.keys())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database patch error: {str(e)}")

@app.post("/api/resume/avatar")
def upload_avatar(file: UploadFile = File(...), token: str = Depends(get_auth_token)):
    """Save uploaded profile avatar and update avatarUrl in database."""
    # Ensure folder exists
    config.AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    
    # Save file
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
        
    avatar_filename = f"avatar_owner{file_extension}"
    file_path = config.AVATAR_DIR / avatar_filename
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update database with new relative URL
        relative_url = f"/static/avatars/{avatar_filename}"
        current_data = config.load_resume_data()
        current_data["avatarUrl"] = relative_url
        config.save_resume_data(current_data)
        
        return {"avatarUrl": relative_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
