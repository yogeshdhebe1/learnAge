from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import date

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str  # "student", "teacher", "parent"
    class_id: Optional[str] = None
    parent_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    uid: str
    email: str
    name: str
    role: str
    class_id: Optional[str] = None

# Attendance Schemas
class AttendanceRecord(BaseModel):
    student_id: str
    student_name: str
    status: str  # "present" or "absent"

class MarkAttendanceRequest(BaseModel):
    class_id: str
    date: str
    attendance_records: List[AttendanceRecord]

# Homework Schemas
class AssignHomeworkRequest(BaseModel):
    class_id: str
    subject: str
    due_date: str
    description: Optional[str] = None

class HomeworkResponse(BaseModel):
    id: str
    subject: str
    due_date: str
    description: Optional[str] = None
    submitted: bool = False

# AI Chat Schema
class AIChatRequest(BaseModel):
    question: str
    context: Optional[str] = None
