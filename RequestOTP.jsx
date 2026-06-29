// src/components/RequestOTP.jsx
import { useState } from "react";

const API = "http://localhost:5000/api";

export default function RequestOTP({ onOtpSent }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const handleSend = async () => {
    if (!identifier.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res  = await fetch(`${API}/generate-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        onOtpSent(identifier.trim(), data.demo_otp ?? "");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Cannot reach the server. Is server.py running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="icon">📧</div>
      <h1>Verify Your Identity</h1>
      <p className="subtitle">
        Enter your <span>email or phone number</span> and we'll send you a
        one-time code.
      </p>

      <div className="field">
        <label htmlFor="identifier">Email / Phone</label>
        <input
          id="identifier"
          type="text"
          placeholder="you@example.com"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
      </div>

      <button
        className="btn"
        disabled={!identifier.trim() || loading}
        onClick={handleSend}
      >
        {loading ? "Sending…" : "Send OTP"}
      </button>

      {error && <div className="status error">{error}</div>}
    </div>
  );
}
