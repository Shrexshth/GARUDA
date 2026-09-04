import urllib.request
import urllib.error

def check_url(url, timeout=3):
    try:
        response = urllib.request.urlopen(url, timeout=timeout)
        return True, response.getcode()
    except Exception as e:
        return False, str(e)

if __name__ == "__main__":
    print("Verifying Airgap Environment...\n")
    
    # 1. Test External (Google)
    print("Testing external connectivity (Google)...")
    success, result = check_url("http://google.com")
    if success:
        print(f"❌ FAIL: External internet is reachable (Status: {result})")
    else:
        print(f"✅ PASS: External internet is blocked ({result})")
        
    print("\nTesting internal connectivity (FastAPI)...")
    # 2. Test Internal
    success, result = check_url("http://127.0.0.1:8000/api/health")
    if success:
        print(f"✅ PASS: Local API is reachable (Status: {result})")
    else:
        print(f"❌ FAIL: Local API is unreachable ({result})")
