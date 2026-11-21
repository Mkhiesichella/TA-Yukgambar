export function Loading({ text = 'Memuat…' }) {
  return (
    <div className="state" role="status">
      <span className="spin" /> {text}
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="state err" role="alert">
      ⚠ {message}
      <br />
      <button className="go" style={{ marginTop: 10 }} onClick={onRetry}>
        Coba lagi
      </button>
    </div>
  );
}
