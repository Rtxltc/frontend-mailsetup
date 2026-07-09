import sys
import os

# Set DATABASE_URL so test.py can read it
os.environ["DATABASE_URL"] = "postgresql://postgres:vaJPaWemRtRozQRcHTPoPUyiflzSyicr@hayabusa.proxy.rlwy.net:43874/railway"

# Add backend directory to sys.path
backend_dir = "/home/yash/Documents/mailsetup/mailsetup/backend"
sys.path.insert(0, backend_dir)

try:
    import test
    
    # 1. Test get_incoming() (previously threw exception)
    print("Testing get_incoming()...")
    emails = test.get_incoming()
    print(f"Success! Number of emails returned: {len(emails)}")
    print(f"Emails: {emails}")
    
    # 2. Test search_incoming()
    print("\nTesting search_incoming()...")
    search_results = test.search_incoming("test")
    print(f"Success! Number of search results: {len(search_results)}")
    
    print("\nAll direct function calls PASSED successfully!")
except Exception as e:
    print("Error running tests:", e)
    sys.exit(1)

