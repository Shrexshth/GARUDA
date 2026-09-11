import requests
import sys
import time

def test_connection(url: str, should_succeed: bool, timeout: int = 3):
    print(f"Testing connection to {url} ... ", end="")
    try:
        response = requests.get(url, timeout=timeout)
        success = response.status_code == 200
        if success:
            if should_succeed:
                print("✅ SUCCESS (Expected)")
            else:
                print("❌ SUCCESS (UNEXPECTED! Airgap is broken!)")
                return False
        else:
            print(f"⚠️ FAILED with status {response.status_code}")
            return not should_succeed
            
    except requests.exceptions.RequestException as e:
        if not should_succeed:
            print("✅ FAILED (Expected. Network is isolated)")
        else:
            print(f"❌ FAILED (UNEXPECTED! Local server is down? Error: {e})")
            return False
            
    return True

if __name__ == "__main__":
    print("="*50)
    print("GAURDA Airgap Verification Tool")
    print("="*50)
    
    # Test 1: External Network (Must Fail)
    external_url = "https://google.com"
    ext_passed = test_connection(external_url, should_succeed=False)
    
    # Test 2: Local Backend API (Must Succeed)
    local_url = "http://localhost:8000/api/health"
    # Give the backend a second if we just started it
    time.sleep(1)
    local_passed = test_connection(local_url, should_succeed=True)
    
    print("\n" + "="*50)
    if ext_passed and local_passed:
        print("✅ AIRGAP VERIFICATION PASSED. The system is secure.")
        sys.exit(0)
    else:
        print("❌ AIRGAP VERIFICATION FAILED! Do not proceed with confidential data.")
        sys.exit(1)
