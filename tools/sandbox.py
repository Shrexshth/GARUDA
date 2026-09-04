import subprocess
import tempfile
import os

def execute_code(code_string: str, timeout_seconds: int = 5) -> dict:
    """
    Executes Python code in an isolated subprocess.
    Uses temporary files and a stripped environment to limit scope.
    """
    # Create a stripped environment with no API keys or sensitive variables
    safe_env = {
        "PATH": os.environ.get("PATH", "/usr/bin:/bin:/usr/sbin:/sbin"),
        "PYTHONUNBUFFERED": "1"
    }
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
        temp_file.write(code_string)
        temp_file_path = temp_file.name

    try:
        # Run code as a separate subprocess
        result = subprocess.run(
            ["python3", temp_file_path],
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
            env=safe_env
        )
        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "timeout": False
        }
    except subprocess.TimeoutExpired as e:
        return {
            "success": False,
            "stdout": e.stdout.decode() if isinstance(e.stdout, bytes) else (e.stdout or ""),
            "stderr": f"Execution timed out after {timeout_seconds} seconds.",
            "timeout": True
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": str(e),
            "timeout": False
        }
    finally:
        # Cleanup
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    # Test block
    test_code = """
import math
print(f"The square root of 144 is {math.sqrt(144)}")
"""
    print("Running sandbox test...")
    result = execute_code(test_code)
    print("Success:", result["success"])
    print("Stdout:", result["stdout"].strip())
    if result["stderr"]:
        print("Stderr:", result["stderr"].strip())
