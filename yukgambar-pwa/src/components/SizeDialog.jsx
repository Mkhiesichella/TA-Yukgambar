import { useEffect, useState } from 'react';

const PRESETS = [
  ['Landscape 3:2', 1200, 800],
  ['Potret 2:3', 800, 1200],
  ['Persegi 1:1', 1000, 1000],
  ['Layar lebar 16:9', 1600, 900],
];
export const MIN_SIZE = 200;
export const MAX_SIZE = 1600;

export default function SizeDialog({ w, h, onCancel, onApply }) {
  const [cw, setW] = useState(String(w));
  const [ch, setH] = useState(String(h));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nw = parseInt(cw, 10), nh = parseInt(ch, 10);
  const ok = (n) => Number.isInteger(n) && n >= MIN_SIZE && n <= MAX_SIZE;
  const valid = ok(nw) && ok(nh);

  return (
    <div className="back" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="szt"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onApply(nw, nh);
        }}
      >
        <h2 id="szt">Ukuran kanvas</h2>
        <div className="chips" style={{ marginTop: 0 }}>
          {PRESETS.map(([label, pw, ph]) => (
            <button
              type="button"
              key={label}
              className={nw === pw && nh === ph ? 'sel' : ''}
              onClick={() => { setW(String(pw)); setH(String(ph)); }}
            >
              {label} · {pw}×{ph}
            </button>
          ))}
        </div>
        <div className="bar" style={{ margin: 0 }}>
          <label className="f" style={{ flex: 1 }}>
            Lebar (px)
            <input type="number" min={MIN_SIZE} max={MAX_SIZE} value={cw} onChange={(e) => setW(e.target.value)} />
          </label>
          <label className="f" style={{ flex: 1 }}>
            Tinggi (px)
            <input type="number" min={MIN_SIZE} max={MAX_SIZE} value={ch} onChange={(e) => setH(e.target.value)} />
          </label>
        </div>
        <small className="muted">
          Ukuran {MIN_SIZE}–{MAX_SIZE} px. Gambar yang sudah ada dipertahankan di pojok kiri atas
          (terpotong jika kanvas lebih kecil). Riwayat undo/redo direset.
        </small>
        {!valid && <small style={{ color: 'var(--danger)' }}>Isi lebar dan tinggi antara {MIN_SIZE} dan {MAX_SIZE}.</small>}
        <div className="bar" style={{ justifyContent: 'flex-end', margin: '4px 0 0' }}>
          <button type="button" onClick={onCancel}>Batal</button>
          <button type="submit" className="go" disabled={!valid}>Terapkan</button>
        </div>
      </form>
    </div>
  );
}
