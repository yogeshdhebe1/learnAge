import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.config import get_settings
from datetime import datetime
from typing import List, Dict, Optional
import os
import json

settings = get_settings()

# Initialize Firebase Admin FIRST
if not firebase_admin._apps:
    # Try to load from environment variable first (for production)
    firebase_creds = os.getenv('FIREBASE_CREDENTIALS')
    if firebase_creds:
        # Production: use environment variable
        cred_dict = json.loads(firebase_creds)
        cred = credentials.Certificate(cred_dict)
    else:
        # Local development: use file
        cred = credentials.Certificate(settings.firebase_credentials_path)
            
    firebase_admin.initialize_app(cred)

# NOW get Firestore client (after initialization)
db = firestore.client()

class FirebaseService:
    
    # ==================== USER OPERATIONS ====================
    
    @staticmethod
    def create_user_profile(uid: str, email: str, name: str, role: str, 
                          class_id: Optional[str] = None, 
                          parent_id: Optional[str] = None):
        """Create user profile in Firestore"""
        user_data = {
            "uid": uid,
            "email": email,
            "name": name,
            "role": role,
            "created_at": datetime.now()
        }
        
        if class_id:
            user_data["class_id"] = class_id
        if parent_id:
            user_data["parent_id"] = parent_id
            
        db.collection("users").document(uid).set(user_data)
        return user_data
    
    @staticmethod
    def get_user_profile(uid: str):
        """Get user profile from Firestore"""
        doc = db.collection("users").document(uid).get()
        if doc.exists:
            return doc.to_dict()
        return None
    
    # ==================== STUDENT OPERATIONS ====================
    
    @staticmethod
    def get_student_dashboard(student_id: str):
        """Get student dashboard data"""
        user = FirebaseService.get_user_profile(student_id)
        if not user:
            return None
        
        # Get today's attendance
        today = datetime.now().strftime("%Y-%m-%d")
        attendance_query = db.collection("attendance")\
            .where("student_id", "==", student_id)\
            .where("date", "==", today)\
            .limit(1)\
            .stream()
        
        today_attendance = "Not Marked"
        for doc in attendance_query:
            today_attendance = doc.to_dict().get("status", "Not Marked").capitalize()
        
        # Get pending homework count
        homework_query = db.collection("homework")\
            .where("class_id", "==", user.get("class_id"))\
            .stream()
        
        pending_count = 0
        for hw in homework_query:
            hw_data = hw.to_dict()
            submissions = hw_data.get("submissions", {})
            if student_id not in submissions or not submissions[student_id].get("submitted"):
                pending_count += 1
        
        return {
            "name": user.get("name"),
            "class_id": user.get("class_id"),
            "today_attendance": today_attendance,
            "pending_homework": pending_count
        }
    
    @staticmethod
    def get_student_attendance(student_id: str):
        """Get student attendance history"""
        attendance_docs = db.collection("attendance")\
            .where("student_id", "==", student_id)\
            .order_by("date", direction=firestore.Query.DESCENDING)\
            .limit(30)\
            .stream()
        
        attendance_list = []
        for doc in attendance_docs:
            data = doc.to_dict()
            attendance_list.append({
                "date": data.get("date"),
                "status": data.get("status").capitalize()
            })
        
        return attendance_list
    
    @staticmethod
    def get_student_homework(student_id: str):
        """Get homework for student's class"""
        user = FirebaseService.get_user_profile(student_id)
        if not user:
            return []
        
        homework_docs = db.collection("homework")\
            .where("class_id", "==", user.get("class_id"))\
            .order_by("due_date")\
            .stream()
        
        homework_list = []
        for doc in homework_docs:
            data = doc.to_dict()
            submissions = data.get("submissions", {})
            submitted = submissions.get(student_id, {}).get("submitted", False)
            
            homework_list.append({
                "id": doc.id,
                "subject": data.get("subject"),
                "due_date": data.get("due_date"),
                "description": data.get("description", ""),
                "submitted": submitted
            })
        
        return homework_list
    
    @staticmethod
    def mark_homework_submitted(homework_id: str, student_id: str):
        """Mark homework as submitted"""
        hw_ref = db.collection("homework").document(homework_id)
        hw_ref.update({
            f"submissions.{student_id}": {
                "submitted": True,
                "submitted_at": datetime.now()
            }
        })
        return True
    
    # ==================== TEACHER OPERATIONS ====================
    
    @staticmethod
    def get_teacher_dashboard(teacher_id: str):
        """Get teacher dashboard data"""
        user = FirebaseService.get_user_profile(teacher_id)
        if not user:
            return None
        
        return {
            "name": user.get("name"),
            "class_id": user.get("class_id")
        }
    
    @staticmethod
    def get_students_by_class(class_id: str):
        """Get all students in a class"""
        students_query = db.collection("users")\
            .where("role", "==", "student")\
            .where("class_id", "==", class_id)\
            .stream()
        
        students = []
        for doc in students_query:
            data = doc.to_dict()
            students.append({
                "id": data.get("uid"),
                "name": data.get("name"),
                "email": data.get("email")
            })
        
        return students
    
    @staticmethod
    def mark_attendance(class_id: str, date: str, attendance_records: List[Dict], teacher_id: str):
        """Mark attendance for multiple students"""
        batch = db.batch()
        
        for record in attendance_records:
            attendance_ref = db.collection("attendance").document()
            batch.set(attendance_ref, {
                "student_id": record["student_id"],
                "student_name": record["student_name"],
                "class_id": class_id,
                "date": date,
                "status": record["status"],
                "marked_by": teacher_id,
                "marked_at": datetime.now()
            })
        
        batch.commit()
        return True
    
    @staticmethod
    def assign_homework(class_id: str, subject: str, due_date: str, 
                       description: str, teacher_id: str):
        """Assign homework to a class"""
        hw_ref = db.collection("homework").document()
        hw_ref.set({
            "class_id": class_id,
            "subject": subject,
            "due_date": due_date,
            "description": description,
            "assigned_by": teacher_id,
            "assigned_date": datetime.now().strftime("%Y-%m-%d"),
            "submissions": {}
        })
        return hw_ref.id
    
    # ==================== PARENT OPERATIONS ====================
    
    @staticmethod
    def get_parent_dashboard(parent_id: str):
        """Get parent dashboard with child info"""
        # Find child linked to parent
        children_query = db.collection("users")\
            .where("parent_id", "==", parent_id)\
            .where("role", "==", "student")\
            .limit(1)\
            .stream()
        
        for doc in children_query:
            child_data = doc.to_dict()
            return {
                "child_name": child_data.get("name"),
                "child_id": child_data.get("uid"),
                "class_id": child_data.get("class_id")
            }
        
        return None
    
    @staticmethod
    def get_child_attendance(child_id: str):
        """Get child's attendance (for parent)"""
        return FirebaseService.get_student_attendance(child_id)
    
    @staticmethod
    def get_child_homework(child_id: str):
        """Get child's homework status (for parent)"""
        return FirebaseService.get_student_homework(child_id)
