from fastapi import APIRouter, HTTPException
from app.services.firebase_service import FirebaseService

router = APIRouter(prefix="/api/parent", tags=["Parent"])

@router.get("/dashboard/{parent_id}")
async def get_dashboard(parent_id: str):
    """Get parent dashboard with child info"""
    try:
        dashboard_data = FirebaseService.get_parent_dashboard(parent_id)
        
        if not dashboard_data:
            raise HTTPException(status_code=404, detail="No child found for this parent")
        
        return dashboard_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/attendance/{child_id}")
async def get_child_attendance(child_id: str):
    """Get child's attendance history"""
    try:
        attendance = FirebaseService.get_child_attendance(child_id)
        return {"attendance": attendance}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/homework/{child_id}")
async def get_child_homework(child_id: str):
    """Get child's homework status"""
    try:
        homework = FirebaseService.get_child_homework(child_id)
        return {"homework": homework}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
