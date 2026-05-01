from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.document import Document, RelatedType
from app.schemas.document import DocumentResponse
from app.services.project_service import get_project


def get_documents(db: Session, project_id: int) -> list[Document]:
    get_project(db, project_id)
    return db.query(Document).filter(Document.project_id == project_id).all()


def create_document(
    db: Session,
    project_id: int,
    file_name: str,
    file_url: str,
    mime_type: str,
    file_size: float,
    uploaded_by: int,
    related_type: RelatedType = RelatedType.project,
    related_id: int | None = None,
) -> Document:
    get_project(db, project_id)
    doc = Document(
        project_id=project_id,
        related_type=related_type,
        related_id=related_id,
        file_name=file_name,
        file_url=file_url,
        mime_type=mime_type,
        file_size=file_size,
        uploaded_by=uploaded_by,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def delete_document(db: Session, document_id: int) -> None:
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
