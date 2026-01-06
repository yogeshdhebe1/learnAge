"""
Demo Data Seeder for LearnAge Platform
This script creates demo users and initial data in Firebase
"""

import firebase_admin
from firebase_admin import credentials, auth, firestore
from datetime import datetime, timedelta
import random

# Initialize Firebase
cred = credentials.Certificate('./firebase/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def create_user_with_profile(email, password, name, role, class_id=None, parent_id=None):
    """Create a Firebase Auth user and Firestore profile"""
    try:
        # Create Firebase Auth user
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name
        )
        print(f"✓ Created user: {email}")
        
        # Create Firestore profile
        user_data = {
            "uid": user.uid,
            "email": email,
            "name": name,
            "role": role,
            "created_at": datetime.now()
        }
        
        if class_id:
            user_data["class_id"] = class_id
        if parent_id:
            user_data["parent_id"] = parent_id
            
        db.collection("users").document(user.uid).set(user_data)
        print(f"✓ Created profile for: {name}")
        
        return user.uid
        
    except auth.EmailAlreadyExistsError:
        print(f"⚠ User already exists: {email}")
        # Get existing user
        user = auth.get_user_by_email(email)
        return user.uid
    except Exception as e:
        print(f"✗ Error creating user {email}: {e}")
        return None

def seed_attendance(student_id, student_name, class_id):
    """Create sample attendance records for the last 10 days"""
    print(f"Creating attendance records for {student_name}...")
    
    for i in range(10):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        status = random.choice(["present", "present", "present", "absent"])  # 75% present
        
        db.collection("attendance").add({
            "student_id": student_id,
            "student_name": student_name,
            "class_id": class_id,
            "date": date,
            "status": status,
            "marked_by": "teacher_uid",
            "marked_at": datetime.now()
        })
    
    print(f"✓ Created 10 attendance records for {student_name}")

def seed_homework(class_id, teacher_id):
    """Create sample homework assignments"""
    print(f"Creating homework for class {class_id}...")
    
    homework_list = [
        {
            "subject": "Mathematics",
            "due_date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
            "description": "Complete Chapter 5 exercises (Page 45-50)"
        },
        {
            "subject": "Science",
            "due_date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
            "description": "Prepare a report on photosynthesis"
        },
        {
            "subject": "English",
            "due_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "description": "Write an essay on 'My Favorite Book' (500 words)"
        },
        {
            "subject": "History",
            "due_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
            "description": "Read Chapter 3 and answer questions"
        }
    ]
    
    for hw in homework_list:
        db.collection("homework").add({
            "class_id": class_id,
            "subject": hw["subject"],
            "due_date": hw["due_date"],
            "description": hw["description"],
            "assigned_by": teacher_id,
            "assigned_date": datetime.now().strftime("%Y-%m-%d"),
            "submissions": {}
        })
        print(f"✓ Created homework: {hw['subject']}")

def main():
    """Main seeding function"""
    print("\n" + "="*60)
    print("LearnAge Platform - Demo Data Seeder")
    print("="*60 + "\n")
    
    class_id = "Class-10A"
    
    # Create Teacher
    print("\n[1/4] Creating Teacher Account...")
    teacher_id = create_user_with_profile(
        email="teacher@test.com",
        password="password123",
        name="Ms. Sarah Johnson",
        role="teacher",
        class_id=class_id
    )
    
    # Create Parent
    print("\n[2/4] Creating Parent Account...")
    parent_id = create_user_with_profile(
        email="parent@test.com",
        password="password123",
        name="Mr. Robert Smith",
        role="parent"
    )
    
    # Create Students
    print("\n[3/4] Creating Student Accounts...")
    
    students = [
        {"email": "student@test.com", "name": "John Smith"},
        {"email": "alice@test.com", "name": "Alice Johnson"},
        {"email": "bob@test.com", "name": "Bob Williams"},
    ]
    
    student_ids = []
    for idx, student in enumerate(students):
        # Link first student to parent
        parent_link = parent_id if idx == 0 else None
        
        student_id = create_user_with_profile(
            email=student["email"],
            password="password123",
            name=student["name"],
            role="student",
            class_id=class_id,
            parent_id=parent_link
        )
        student_ids.append((student_id, student["name"]))
    
    # Seed Data
    print("\n[4/4] Seeding Sample Data...")
    
    if teacher_id:
        seed_homework(class_id, teacher_id)
    
    for student_id, student_name in student_ids:
        if student_id:
            seed_attendance(student_id, student_name, class_id)
    
    print("\n" + "="*60)
    print("✓ Demo Data Seeding Complete!")
    print("="*60)
    print("\nDemo Accounts Created:")
    print("\n1. Teacher Account:")
    print("   Email: teacher@test.com")
    print("   Password: password123")
    print("\n2. Student Account:")
    print("   Email: student@test.com")
    print("   Password: password123")
    print("\n3. Parent Account:")
    print("   Email: parent@test.com")
    print("   Password: password123")
    print("\nYou can now login to the application!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
