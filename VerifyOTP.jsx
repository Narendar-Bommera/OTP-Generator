// src/components/VerifyOTP.jsx
import { useState, useRef, useEffect } from "react";

const API          = "http://localhost:5000/api";
const OTP_LENGTH   = 6;
const RESEND_DELAY = 30;

function range(n) { return Array.from({ length: n }, (_, i) => i); }

export default function VerifyOTP({ identifier, demoOtp, onVerified, onBack }) {
  const [digits, setDigits]       = useState(Array(OTP_LENGTH).fill(""));
  const [status, setStatus]       = useState(null);   // null | "success" | "error"
  const [message, setMessage]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (idx, value) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    setStatus(null);
    if (char && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits]; next[idx] = ""; setDigits(next);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && idx > 0)           inputRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < OTP_LENGTH-1) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = e => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/verify-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ identifier, otp: digits.join("") }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setTimeout(onVerified, 900);
      } else {
        setStatus("error");
        setMessage(data.message);
        setDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch {
      setStatus("error");
      setMessage("Cannot reach the server. Is server.py running?");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setStatus(null);
    setCountdown(RESEND_DELAY);
    await fetch(`${API}/generate-otp`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ identifier }),
    });
    inputRefs.current[0]?.focus();
  };

  const full     = digits.every(d => d !== "");
  const boxClass = i => {
    let c = "otp-box";
    if (digits[i]) c += " filled";
    if (status === "success") c += " ok";
    if (status === "error")   c += " bad";
    return c;
  };

  return (
    <div className="card">
      <div className="icon">🔐</div>
      <h1>Enter Your Code</h1>
      <p className="subtitle">
        A <span>{OTP_LENGTH}-digit code</span> was sent to{" "}
        <span>{identifier}</span>. It expires in 5 minutes.
      </p>

      <div className="otp-row">
        {range(OTP_LENGTH).map(i => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            className={boxClass(i)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i]}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>

      <button
        className="btn"
        disabled={!full || loading || status === "success"}
        onClick={handleVerify}
      >
        {loading ? "Verifying…" : status === "success" ? "Verified ✓" : "Verify Code"}
      </button>

      <button className="btn btn-ghost" onClick={onBack}>
        ← Change Email / Phone
      </button>

      {status && <div className={`status ${status}`}>{message}</div>}

      <div className="resend">
        Didn't receive it?&nbsp;
        <button onClick={handleResend} disabled={countdown > 0}>
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
        </button>
      </div>

      {/* Demo helper – remove in production */}
      {demoOtp && (
        <div className="demo-badge">
          Demo OTP: <strong>{demoOtp}</strong>
        </div>
      )}
    </div>
  );
}
