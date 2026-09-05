import os
import sys
import tempfile
import subprocess
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

def execute_python_code(code_string: str) -> Dict[str, Any]:
    """
    Executes Python code securely in an isolated subprocess.
    Does NOT use Docker (to save memory).
    Safely creates a temp file and explicitly deletes ONLY that file.
    """
    result = {
        "success": False,
        "stdout": "",
        "stderr": ""
    }

    # Fetch configuration from env
    timeout_seconds = float(os.getenv("SANDBOX_TIMEOUT_SECONDS", "5.0"))

    # Create a stripped environment
    # No PATH or network configuration is passed through
    safe_env = {
        "PYTHONUNBUFFERED": "1"
    }

    # Securely create a temporary file
    fd, temp_file_path = tempfile.mkstemp(suffix=".py", text=True)
    
    try:
        # Write the code to the temporary file securely
        with os.fdopen(fd, 'w') as f:
            f.write(code_string)
            
        # Execute the code in an isolated subprocess with a hard timeout
        process = subprocess.run(
            [sys.executable, temp_file_path],
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
            env=safe_env
        )
        
        result["success"] = process.returncode == 0
        result["stdout"] = process.stdout
        result["stderr"] = process.stderr
        
    except subprocess.TimeoutExpired as e:
        result["success"] = False
        result["stdout"] = e.stdout.decode('utf-8') if isinstance(e.stdout, bytes) else (e.stdout or "")
        result["stderr"] = f"Execution timed out after {timeout_seconds} seconds.\n{(e.stderr.decode('utf-8') if isinstance(e.stderr, bytes) else (e.stderr or '')) if hasattr(e, 'stderr') and e.stderr else ''}"
    except Exception as e:
        result["success"] = False
        result["stderr"] = f"Runtime execution error: {str(e)}"
    finally:
        # Safely remove exactly and only this temporary file
        try:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        except OSError as e:
            # We catch OSError to prevent the FastAPI thread from crashing if cleanup fails
            print(f"Failed to clean up temp file {temp_file_path}: {e}")

    return result

if __name__ == "__main__":
    test_code = """
import math
print(f"Square root of 144 is {math.sqrt(144)}")
"""
    print(execute_python_code(test_code))
