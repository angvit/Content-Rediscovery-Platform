from sqlalchemy import Column, ForeignKey, TIMESTAMP, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class ContentItem(Base):
    __tablename__ = "content_item"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    content_id = Column(UUID(as_uuid=True), ForeignKey("content.content_id"), primary_key=True)
    saved_at = Column(TIMESTAMP(timezone=True), default=func.now())
    notes = Column(String, nullable=True)
    content = relationship("Content", backref="content_items")


# class ContentItem(Base):
#     __tablename__ = "content_item"
    
#     item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
#     content_id = Column(UUID(as_uuid=True), ForeignKey("content.content_id"))
#     saved_at = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"))
