// src/components/Success.jsx
export default function Success({ identifier, onRestart }) {
  return (
    <div className="card">
      <div className="success-icon">✓</div>
      <h1>Verified!</h1>
      <p className="subtitle">
        <span>{identifier}</span> has been successfully verified.
        You're all set.
      </p>

      <button className="btn" onClick={onRestart}>
        Start Over
      </button>
    </div>
  );
}
