from fastapi import APIRouter, HTTPException
from app.services.firebase_service import FirebaseService

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.get("/dashboard/{student_id}")
async def get_dashboard(student_id: str):
    """Get student dashboard data"""
    try:
        dashboard_data = FirebaseService.get_student_dashboard(student_id)
        
        if not dashboard_data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return dashboard_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/attendance/{student_id}")
async def get_attendance(student_id: str):
    """Get student attendance history"""
    try:
        attendance = FirebaseService.get_student_attendance(student_id)
        return {"attendance": attendance}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/homework/{student_id}")
async def get_homework(student_id: str):
    """Get homework for student"""
    try:
        homework = FirebaseService.get_student_homework(student_id)
        return {"homework": homework}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/homework/{homework_id}/submit")
async def submit_homework(homework_id: str, student_id: str):
    """Mark homework as submitted"""
    try:
        FirebaseService.mark_homework_submitted(homework_id, student_id)
        return {"message": "Homework marked as submitted"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
