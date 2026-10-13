from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In a production serverless app, this should connect to Neon (Postgres) or MongoDB.
# For now, we use a secure in-memory mock database to validate the flow.
fake_users_db = {}

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "user" # Can be 'user' or 'admin'

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    fake_users_db[user.email] = {
        "email": user.email,
        "password": get_password_hash(user.password),
        "role": user.role
    }
    return {"message": "User successfully registered"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = fake_users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email, "role": db_user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "role": db_user["role"]}