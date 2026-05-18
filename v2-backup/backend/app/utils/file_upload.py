import os
import uuid
from fastapi import UploadFile, HTTPException
from app.core.config import settings


async def save_upload(file: UploadFile) -> tuple[str, str, float]:
    """Save uploaded file to disk. Returns (file_url, mime_type, file_size_kb)."""
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)

    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"File too large. Max {settings.MAX_UPLOAD_SIZE_MB} MB")

    if file.content_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=415, detail=f"File type not allowed: {file.content_type}")

    ext = os.path.splitext(file.filename or "file")[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_name)

    with open(file_path, "wb") as f:
        f.write(content)

    file_url = f"/uploads/{unique_name}"
    return file_url, file.content_type or "application/octet-stream", round(size_mb * 1024, 2)
