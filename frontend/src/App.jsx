// src/App.jsx
import { useState } from "react";
import RequestOTP from "./components/RequestOTP";
import VerifyOTP  from "./components/VerifyOTP";
import Success    from "./components/Success";
import "./App.css";

export default function App() {
  // "request" → "verify" → "success"
  const [step, setStep]             = useState("request");
  const [identifier, setIdentifier] = useState("");
  const [demoOtp, setDemoOtp]       = useState("");   // remove in production

  const handleOtpSent = (id, demo) => {
    setIdentifier(id);
    setDemoOtp(demo);
    setStep("verify");
  };

  const handleVerified = () => setStep("success");
  const handleRestart  = () => { setStep("request"); setIdentifier(""); setDemoOtp(""); };

  return (
    <div className="app-shell">
      {step === "request" && <RequestOTP onOtpSent={handleOtpSent} />}
      {step === "verify"  && (
        <VerifyOTP
          identifier={identifier}
          demoOtp={demoOtp}
          onVerified={handleVerified}
          onBack={handleRestart}
        />
      )}
      {step === "success" && <Success identifier={identifier} onRestart={handleRestart} />}
    </div>
  );
}
