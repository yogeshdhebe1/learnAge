# from fastapi import APIRouter, HTTPException
# from app.models.schemas import MarkAttendanceRequest, AssignHomeworkRequest
# from app.services.firebase_service import FirebaseService

# router = APIRouter(prefix="/api/teacher", tags=["Teacher"])

# @router.get("/dashboard/{teacher_id}")
# async def get_dashboard(teacher_id: str):
#     """Get teacher dashboard data"""
#     try:
#         dashboard_data = FirebaseService.get_teacher_dashboard(teacher_id)
        
#         if not dashboard_data:
#             raise HTTPException(status_code=404, detail="Teacher not found")
        
#         return dashboard_data
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/students/{class_id}")
# async def get_students(class_id: str):
#     """Get all students in a class"""
#     try:
#         students = FirebaseService.get_students_by_class(class_id)
#         return {"students": students}
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/attendance")
# async def mark_attendance(attendance_data: MarkAttendanceRequest, teacher_id: str):
#     """Mark attendance for students"""
#     try:
#         FirebaseService.mark_attendance(
#             class_id=attendance_data.class_id,
#             date=attendance_data.date,
#             attendance_records=[record.dict() for record in attendance_data.attendance_records],
#             teacher_id=teacher_id
#         )
        
#         return {"message": "Attendance marked successfully"}
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/homework")
# async def assign_homework(homework_data: AssignHomeworkRequest, teacher_id: str):
#     """Assign homework to a class"""
#     try:
#         homework_id = FirebaseService.assign_homework(
#             class_id=homework_data.class_id,
#             subject=homework_data.subject,
#             due_date=homework_data.due_date,
#             description=homework_data.description or "",
#             teacher_id=teacher_id
#         )
        
#         return {
#             "message": "Homework assigned successfully",
#             "homework_id": homework_id
#         }
        
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/add-student")
# async def add_student(student_data: dict, teacher_id: str):
#     """Add a new student to the class"""
#     try:
#         from firebase_admin import auth as firebase_auth
#         from app.services.firebase_service import FirebaseService
        
#         # Create Firebase Auth user
#         user = firebase_auth.create_user(
#             email=student_data['email'],
#             password=student_data['password']
#         )
        
#         # Create user profile in Firestore
#         FirebaseService.create_user_profile(
#             uid=user.uid,
#             email=student_data['email'],
#             name=student_data['name'],
#             role='student',
#             class_id=student_data['class_id']
#         )
        
#         return {
#             "message": "Student added successfully",
#             "student_id": user.uid,
#             "student_name": student_data['name']
#         }
        
#     except firebase_auth.EmailAlreadyExistsError:
#         raise HTTPException(status_code=400, detail="Email already exists")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


from fastapi import APIRouter, HTTPException, Query
from typing import List
from pydantic import BaseModel
from app.services.firebase_service import FirebaseService

router = APIRouter(prefix="/teacher", tags=["Teacher"])

class AttendanceRecord(BaseModel):
    student_id: str
    student_name: str
    status: str

class AttendanceData(BaseModel):
    class_id: str
    date: str
    attendance: List[AttendanceRecord]

class HomeworkData(BaseModel):
    class_id: str
    subject: str
    due_date: str
    description: str

class StudentData(BaseModel):
    email: str
    password: str
    name: str
    class_id: str

@router.get("/dashboard/{teacher_id}")
async def get_teacher_dashboard(teacher_id: str):
    """Get teacher dashboard data"""
    try:
        dashboard_data = FirebaseService.get_teacher_dashboard(teacher_id)
        if not dashboard_data:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/students/{class_id}")
async def get_class_students(class_id: str):
    """Get all students in a class"""
    try:
        students = FirebaseService.get_students_by_class(class_id)
        return {"students": students}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/attendance")
async def mark_attendance(
    attendance_data: AttendanceData,
    teacher_id: str = Query(...)
):
    """Mark attendance for students"""
    try:
        success = FirebaseService.mark_attendance(
            class_id=attendance_data.class_id,
            date=attendance_data.date,
            attendance_records=[record.dict() for record in attendance_data.attendance],
            teacher_id=teacher_id
        )
        if success:
            return {"message": "Attendance marked successfully"}
        raise HTTPException(status_code=400, detail="Failed to mark attendance")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/homework")
async def assign_homework(
    homework_data: HomeworkData,
    teacher_id: str = Query(...)
):
    """Assign homework to a class"""
    try:
        homework_id = FirebaseService.assign_homework(
            class_id=homework_data.class_id,
            subject=homework_data.subject,
            due_date=homework_data.due_date,
            description=homework_data.description,
            teacher_id=teacher_id
        )
        return {
            "message": "Homework assigned successfully",
            "homework_id": homework_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-student")
async def add_student(
    student_data: StudentData,
    teacher_id: str = Query(...)
):
    """Add a new student to the class"""
    try:
        from firebase_admin import auth
        
        # Create Firebase Auth user
        user = auth.create_user(
            email=student_data.email,
            password=student_data.password
        )
        
        # Create user profile
        profile = FirebaseService.create_user_profile(
            uid=user.uid,
            email=student_data.email,
            name=student_data.name,
            role="student",
            class_id=student_data.class_id
        )
        
        return {
            "message": "Student added successfully",
            "student_id": user.uid
        }
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))