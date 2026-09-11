import requests
from fastapi import APIRouter

router = APIRouter()

@router.get("/airgap")
async def check_airgap():
    """
    Attempts to hit an external URL. 
    If it fails, airgap is secure (0 external requests).
    If it succeeds, airgap is breached.
    """
    external_url = "https://google.com"
    try:
        response = requests.get(external_url, timeout=1)
        if response.status_code == 200:
            return {"secure": False, "message": "Airgap breached! External connection successful."}
        return {"secure": True, "message": "Airgap intact."}
    except requests.exceptions.RequestException:
        return {"secure": True, "message": "Airgap intact."}
