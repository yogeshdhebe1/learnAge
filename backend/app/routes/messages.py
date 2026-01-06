from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from datetime import datetime
from google.cloud.firestore_v1 import FieldFilter
import firebase_admin
from firebase_admin import firestore

# Get Firestore client
db = firestore.client()

router = APIRouter(prefix="/api/messages", tags=["messages"])
class MessageCreate(BaseModel):
    class_id: str
    sender_id: str
    sender_name: str
    sender_role: str
    message: str

class MessageResponse(BaseModel):
    id: str
    class_id: str
    sender_id: str
    sender_name: str
    sender_role: str
    message: str
    timestamp: str

@router.get("/class/{class_id}", response_model=List[MessageResponse])
async def get_class_messages(class_id: str, limit: int = 50):
    """Get all messages for a class"""
    try:
        # Query messages for the class
        messages_ref = db.collection('messages')
        query = messages_ref.where(filter=FieldFilter('class_id', '==', class_id))\
                            .order_by('timestamp', direction=firestore.Query.DESCENDING)\
                            .limit(limit)
        
        messages = []
        docs = query.stream()
        
        for doc in docs:
            data = doc.to_dict()
            messages.append({
                'id': doc.id,
                'class_id': data.get('class_id', ''),
                'sender_id': data.get('sender_id', ''),
                'sender_name': data.get('sender_name', ''),
                'sender_role': data.get('sender_role', ''),
                'message': data.get('message', ''),
                'timestamp': data.get('timestamp').isoformat() if data.get('timestamp') else ''
            })
        
        return messages
        
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send")
async def send_message(message_data: MessageCreate):
    """Send a message to class"""
    try:
        # Create new message document
        message_ref = db.collection('messages').document()
        
        message_ref.set({
            'class_id': message_data.class_id,
            'sender_id': message_data.sender_id,
            'sender_name': message_data.sender_name,
            'sender_role': message_data.sender_role,
            'message': message_data.message,
            'timestamp': datetime.now()
        })
        
        return {
            "message": "Message sent successfully",
            "message_id": message_ref.id
        }
        
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{message_id}")
async def delete_message(message_id: str, user_id: str):
    """Delete a message (only sender can delete)"""
    try:
        message_ref = db.collection('messages').document(message_id)
        message_doc = message_ref.get()
        
        if not message_doc.exists:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message_data = message_doc.to_dict()
        
        # Check if user is the sender
        if message_data.get('sender_id') != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this message")
        
        message_ref.delete()
        
        return {"message": "Message deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))