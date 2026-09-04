"""
Lioc B2B Platform - Admin Password Hash Generator
Use this script to generate secure PBKDF2-HMAC-SHA256 hashes for your .env configuration.

Usage:
    python generate_password_hash.py
    python generate_password_hash.py "your_new_password"
"""

import sys
import getpass
from backend.app.core.security import hash_password


def main():
    print("=" * 60)
    print("  Lioc B2B Platform - Admin Password Hash Generator")
    print("=" * 60)

    if len(sys.argv) > 1:
        raw_password = sys.argv[1]
    else:
        raw_password = getpass.getpass("Enter Admin Password to Hash: ")
        confirm_password = getpass.getpass("Confirm Admin Password: ")
        if raw_password != confirm_password:
            print("\n[ERROR] Passwords do not match!")
            sys.exit(1)

    if not raw_password or len(raw_password) < 6:
        print("\n[ERROR] Password must be at least 6 characters.")
        sys.exit(1)

    hashed = hash_password(raw_password)

    print("\n[SUCCESS] Password hash generated successfully:")
    print("-" * 60)
    print(f"ADMIN_PASSWORD_HASH=\"{hashed}\"")
    print("-" * 60)
    print("\nCopy and paste the line above into your .env and backend/.env file.")


if __name__ == "__main__":
    main()
