import os
import subprocess
import sys
import platform
import shutil

# Define common directories that the installation process needs access to
required_paths = [
    os.path.expanduser("~/Library/Application Support"),
    os.path.expanduser("~/Library/Caches"),
    os.path.expanduser("~/Library/Logs")
]

# Determine the correct Python command based on the system
def determine_python_command():
    return "python" if platform.system() == "Windows" else "python3"

# Check write access to all necessary directories
def has_write_access(paths):
    for path in paths:
        if not os.path.exists(path):
            try:
                os.makedirs(path, exist_ok=True)
            except:
                return False
        if not os.access(path, os.W_OK):
            return False
    return True

# Inform the user to run with admin privileges if access is denied
def handle_permission_issue():
    print("\n The installer does not have permission to access necessary system directories.")
    print("Please run this script with elevated privileges.")
    if platform.system() == "Darwin":
        print("\n Try running the script with sudo:\n")
        print("   sudo python3 main.py\n")
    elif platform.system() == "Linux":
        print("\n Try running the script with sudo:\n")
        print("   sudo python3 main.py\n")
    else:
        print("Make sure you're running this script as Administrator.\n")
    sys.exit(1)

# Ensure pip is installed and up-to-date
def ensure_pip_ready(python_cmd):
    try:
        result = subprocess.run([python_cmd, "-m", "pip", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode != 0:
            print("pip not found. Installing pip...")
            subprocess.run([python_cmd, "-m", "ensurepip"], check=True)
        print("Upgrading pip...")
        subprocess.run([python_cmd, "-m", "pip", "install", "--upgrade", "pip"], check=True)
        print(" pip is ready.")
    except Exception as e:
        print(f" pip setup failed: {e}")
        sys.exit(1)

# Windows-specific PATH fixer
def add_python_to_path_windows():
    try:
        python_path = shutil.which("python")
        pip_path = shutil.which("pip")
        if not python_path:
            print("Python not found in PATH.")
            return
        python_dir = os.path.dirname(python_path)
        user_path = os.environ.get("PATH", "")
        if python_dir not in user_path:
            print(f"Adding {python_dir} to PATH...")
            subprocess.run(["setx", "PATH", f"{user_path};{python_dir}"], shell=True)
        if pip_path is None:
            print("pip not found, reinstalling...")
            subprocess.run([python_path, "-m", "ensurepip"], check=True)
            subprocess.run([python_path, "-m", "pip", "install", "--upgrade", "pip"], check=True)
    except Exception as e:
        print(f"Failed to update PATH or fix pip: {e}")
        sys.exit(1)


def ensure_all_good():
    system = platform.system()
    python_cmd = determine_python_command()

    if system == "Windows":
        add_python_to_path_windows()
        ensure_pip_ready("python")
    else:
        print(f"{system} system detected.")
        if not has_write_access(required_paths):
            handle_permission_issue()
        ensure_pip_ready(python_cmd)

if __name__ == "__main__":
    ensure_all_good()
