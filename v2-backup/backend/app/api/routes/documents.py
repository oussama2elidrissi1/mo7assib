import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.document import DocumentResponse
from app.services.document_service import get_documents, create_document, delete_document
from app.utils.file_upload import save_upload
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User
from app.models.document import RelatedType

router = APIRouter(tags=["documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_file(
    project_id: int = Form(...),
    related_type: RelatedType = Form(RelatedType.project),
    related_id: int | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(require_not_viewer),
):
    file_url, mime_type, file_size = await save_upload(file)
    return create_document(
        db,
        project_id=project_id,
        file_name=file.filename or "unknown",
        file_url=file_url,
        mime_type=mime_type,
        file_size=file_size,
        uploaded_by=user.id,
        related_type=related_type,
        related_id=related_id,
    )


@router.get("/projects/{project_id}/documents", response_model=list[DocumentResponse])
def list_documents(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_documents(db, project_id)


@router.delete("/documents/{document_id}", status_code=204)
def remove_document(document_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    delete_document(db, document_id)
