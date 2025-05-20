from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ExpenseBase(BaseModel):
    amount: float
    description: str
    category: str
    date: datetime

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    expenses: List[Expense] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 