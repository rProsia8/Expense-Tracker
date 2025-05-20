from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Union, Any
import models, schemas, auth
from database import get_db

app = FastAPI(
    title="Expense Tracker API",
    description="API for managing personal expenses",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root() -> Dict[str, Any]:
    return {
        "message": "Welcome to the Expense Tracker API",
        "documentation": "/docs",
        "available_endpoints": {
            "auth": [
                "POST /token - Login",
                "POST /users/ - Register"
            ],
            "expenses": [
                "GET /expenses/ - List all expenses",
                "POST /expenses/ - Create expense",
                "GET /expenses/{id} - Get expense",
                "PUT /expenses/{id} - Update expense",
                "DELETE /expenses/{id} - Delete expense"
            ],
            "statistics": [
                "GET /expenses/stats/category - Get expenses by category",
                "GET /expenses/stats/time - Get expenses by time period"
            ]
        }
    }

# Authentication routes
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Expense routes
@app.post("/expenses/", response_model=schemas.Expense)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_expense = models.Expense(**expense.dict(), user_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/expenses/", response_model=List[schemas.Expense])
def read_expenses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    expenses = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return expenses

@app.get("/expenses/{expense_id}", response_model=schemas.Expense)
def read_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@app.put("/expenses/{expense_id}", response_model=schemas.Expense)
def update_expense(
    expense_id: int,
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    for key, value in expense.dict().items():
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

# Statistics routes
@app.get("/expenses/stats/category")
def get_expenses_by_category(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    from sqlalchemy import func
    expenses = db.query(
        models.Expense.category,
        func.sum(models.Expense.amount).label('total')
    ).filter(
        models.Expense.user_id == current_user.id
    ).group_by(models.Expense.category).all()
    return [{"category": e.category, "total": float(e.total)} for e in expenses]

@app.get("/expenses/stats/time")
def get_expenses_by_time(
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    expenses = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id,
        models.Expense.date >= start_date,
        models.Expense.date <= end_date
    ).all()
    return expenses 