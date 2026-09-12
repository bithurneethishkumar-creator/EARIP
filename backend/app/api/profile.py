from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

router = APIRouter()

# In-memory user profile state with persistence during session
_CURRENT_PROFILE: Dict[str, Any] = {
    "id": "usr_neethish_01",
    "name": "Neethish Kumar",
    "email": "neethish.kumar@earip.enterprise.ai",
    "role": "Lead Business Analyst",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    "department": "Retail Decision Intelligence",
    "organization": "Enterprise AI Retail Platform",
    "memberSince": "January 2024",
    "status": "Active • Enterprise",
    "accessTier": "Tier 1 Executive Admin",
    "permissions": [
        "Executive Dashboard Access",
        "RFM Customer Intelligence",
        "ML Time-Series Forecasting",
        "Anomaly Detection Engine",
        "Groq AI Decision System",
        "Dataset Export & Dossier Generation"
    ],
    "preferences": {
        "theme": "Executive Dark",
        "defaultCurrency": "USD ($)",
        "emailAlerts": True,
        "anomalyAlertThreshold": "MEDIUM",
        "aiModel": "Groq Llama-3.3-70B Active"
    },
    "security": {
        "twoFactorEnabled": True,
        "lastLogin": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "sessionStatus": "Active / Valid Token",
        "authProvider": "EARIP Enterprise IAM"
    }
}

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    theme: Optional[str] = None
    defaultCurrency: Optional[str] = None
    emailAlerts: Optional[bool] = None
    anomalyAlertThreshold: Optional[str] = None

@router.get("")
def get_user_profile():
    """
    Returns the authenticated user's profile and preferences.
    """
    return _CURRENT_PROFILE

@router.put("")
def update_user_profile(payload: ProfileUpdateRequest):
    """
    Updates the active user's preferences and profile details.
    """
    global _CURRENT_PROFILE
    if payload.name:
        _CURRENT_PROFILE["name"] = payload.name
    if payload.role:
        _CURRENT_PROFILE["role"] = payload.role
    if payload.email:
        _CURRENT_PROFILE["email"] = payload.email
    if payload.theme:
        _CURRENT_PROFILE["preferences"]["theme"] = payload.theme
    if payload.defaultCurrency:
        _CURRENT_PROFILE["preferences"]["defaultCurrency"] = payload.defaultCurrency
    if payload.emailAlerts is not None:
        _CURRENT_PROFILE["preferences"]["emailAlerts"] = payload.emailAlerts
    if payload.anomalyAlertThreshold:
        _CURRENT_PROFILE["preferences"]["anomalyAlertThreshold"] = payload.anomalyAlertThreshold

    return {
        "success": True,
        "message": "Profile and preferences updated successfully.",
        "profile": _CURRENT_PROFILE
    }

@router.post("/logout")
def logout_user():
    """
    Terminates the user's active session.
    """
    return {
        "success": True,
        "message": "Session terminated successfully. User logged out."
    }
