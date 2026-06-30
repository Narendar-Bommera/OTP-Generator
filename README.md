OTP Verification App
A full-stack OTP system split into a Python backend and a React frontend.
Project Structure
```
otp_project/
├── backend/
│   ├── otp_generator.py   # OTP logic (generate + verify)
│   └── server.py          # Flask REST API
└── frontend/
    ├── src/
    │   ├── App.jsx                    # Root component + step routing
    │   ├── App.css                    # Global styles
    │   ├── main.jsx                   # React entry point
    │   └── components/
    │       ├── RequestOTP.jsx         # Step 1 – enter email/phone
    │       ├── VerifyOTP.jsx          # Step 2 – enter 6-digit code
    │       └── Success.jsx            # Step 3 – success screen
    ├── public/index.html
    ├── package.json
    └── vite.config.js
```
Setup
1 – Backend (Python)
```bash
cd backend
pip install flask flask-cors
python server.py
# → API running at http://localhost:5000
```
2 – Frontend (React)
```bash
cd frontend
npm install
npm run dev
# → UI running at http://localhost:3000
```
API Endpoints
Method	Endpoint	Body	Response
POST	/api/generate-otp	`{ "identifier": "user@example.com" }`	`{ success, message, demo_otp }`
POST	/api/verify-otp	`{ "identifier": "...", "otp": "123456" }`	`{ success, message }`
Flow
```
[User enters email/phone]
        ↓
  POST /api/generate-otp   ← Python generates & stores OTP (TTL 5 min)
        ↓
[User enters 6-digit code]
        ↓
  POST /api/verify-otp     ← Python verifies, deletes (one-time use)
        ↓
       ✓ Success screen
```
Notes
`demo_otp` is returned in the API response for development only — remove it in production and send the OTP via email/SMS instead.
OTPs are stored in memory; swap `_otp_store` in `otp_generator.py` for Redis or a database in production.
