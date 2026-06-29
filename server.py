"""
server.py
─────────
Flask REST API that exposes OTP generate & verify endpoints.

Install deps:
    pip install flask flask-cors

Run:
    python server.py
    → http://localhost:5000

Endpoints:
    POST /api/generate-otp   { "identifier": "user@example.com" }
    POST /api/verify-otp     { "identifier": "user@example.com", "otp": "123456" }
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from otp_generator import generate_otp, verify_otp

app = Flask(__name__)
CORS(app)   # allow the React dev server (port 3000) to call us


@app.route("/api/generate-otp", methods=["POST"])
def api_generate_otp():
    data       = request.get_json(force=True) or {}
    identifier = data.get("identifier", "").strip()

    if not identifier:
        return jsonify({"success": False, "message": "identifier is required"}), 400

    otp = generate_otp(identifier)

    # ── In production: send OTP via email/SMS here, never return it ──
    # send_email(identifier, otp)
    # For demo purposes we return it so you can paste it into the UI:
    return jsonify({
        "success": True,
        "message": f"OTP sent to {identifier}",
        "demo_otp": otp,          # ← remove in production
    })


@app.route("/api/verify-otp", methods=["POST"])
def api_verify_otp():
    data       = request.get_json(force=True) or {}
    identifier = data.get("identifier", "").strip()
    otp_input  = data.get("otp", "").strip()

    if not identifier or not otp_input:
        return jsonify({"success": False, "message": "identifier and otp are required"}), 400

    result = verify_otp(identifier, otp_input)
    status = 200 if result["success"] else 400
    return jsonify(result), status


if __name__ == "__main__":
    print("OTP API running at http://localhost:5000")
    app.run(debug=True, port=5000)
