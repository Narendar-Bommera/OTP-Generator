"""
otp_generator.py
────────────────
Generates, stores, and verifies OTPs.
Run:  python otp_generator.py
"""

import random
import string
import time

# In-memory store: { identifier: { "otp": str, "expires_at": float } }
_otp_store: dict = {}

OTP_LENGTH  = 6      # digits
OTP_TTL_SEC = 300    # 5 minutes


def generate_otp(identifier: str) -> str:
    """Generate a new OTP for the given identifier (email / phone)."""
    otp = "".join(random.choices(string.digits, k=OTP_LENGTH))
    _otp_store[identifier] = {
        "otp": otp,
        "expires_at": time.time() + OTP_TTL_SEC,
    }
    return otp


def verify_otp(identifier: str, otp_input: str) -> dict:
    """
    Verify the OTP entered by the user.
    Returns {"success": bool, "message": str}
    """
    record = _otp_store.get(identifier)

    if not record:
        return {"success": False, "message": "No OTP found. Please request a new one."}

    if time.time() > record["expires_at"]:
        del _otp_store[identifier]
        return {"success": False, "message": "OTP has expired. Please request a new one."}

    if record["otp"] != otp_input.strip():
        return {"success": False, "message": "Incorrect OTP. Please try again."}

    del _otp_store[identifier]   # one-time use
    return {"success": True, "message": "OTP verified successfully!"}


# ── Quick CLI demo ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    user = "user@example.com"

    otp = generate_otp(user)
    print(f"[OTP Generator]  Generated OTP for '{user}': {otp}")

    result = verify_otp(user, otp)
    print(f"[OTP Verifier ]  {result}")

    # Try reusing the same OTP
    result2 = verify_otp(user, otp)
    print(f"[OTP Verifier ]  (reuse attempt) {result2}")
