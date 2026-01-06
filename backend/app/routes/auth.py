from fastapi import APIRouter, HTTPException
from firebase_admin import auth
from app.models.schemas import UserRegister, UserLogin, UserResponse
from app.services.firebase_service import FirebaseService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
async def register_user(user_data: UserRegister):
    """Register a new user with Firebase Auth and create profile"""
    try:
        # Create Firebase Auth user
        user = auth.create_user(
            email=user_data.email,
            password=user_data.password
        )
        
        # Create user profile in Firestore
        profile = FirebaseService.create_user_profile(
            uid=user.uid,
            email=user_data.email,
            name=user_data.name,
            role=user_data.role,
            class_id=user_data.class_id,
            parent_id=user_data.parent_id
        )
        
        return {
            "message": "User registered successfully",
            "uid": user.uid,
            "email": user.email
        }
        
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-token")
async def verify_token(token: str):
    """Verify Firebase ID token and return user info"""
    try:
        # Verify the token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        # Get user profile
        profile = FirebaseService.get_user_profile(uid)
        
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        return {
            "uid": profile["uid"],
            "email": profile["email"],
            "name": profile["name"],
            "role": profile["role"],
            "class_id": profile.get("class_id")
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/user/{uid}", response_model=UserResponse)
async def get_user(uid: str):
    """Get user profile by UID"""
    profile = FirebaseService.get_user_profile(uid)
    
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    
    return profile
