import { useState } from 'react';
import { projectService } from '../services/projectService.js';
import { useAsync, useDebounce } from '../hooks/useAsync.js';
import { ErrorBox, Loading } from '../components/State.jsx';
import { fmt } from '../lib/canvas.js';

const ST = { progress: 'In Progress', done: 'Done' };
const FILTERS = [['all', 'Semua'], ['progress', 'In Progress'], ['done', 'Done']];

export default function Projects({ onOpen }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('new');
  const search = useDebounce(q);
  const { loading, error, data, retry } = useAsync(() => projectService.list({ search, status, sort }), [search, status, sort]);

  return (
    <>
      <h2>Project</h2>
      <div className="muted">Gambar yang sudah kamu simpan.</div>
      <div className="bar" style={{ marginTop: 12 }}>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul…" aria-label="Cari project" />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan">
          <option value="new">Terbaru</option>
          <option value="old">Terlama</option>
        </select>
      </div>
      <div className="chips">
        {FILTERS.map(([k, label]) => (
          <button key={k} className={status === k ? 'sel' : ''} onClick={() => setStatus(k)}>{label}</button>
        ))}
      </div>

      {loading && <Loading text="Memuat project…" />}
      {error && <ErrorBox message={error} onRetry={retry} />}
      {data && !data.length && (
        <div className="empty">
          {q || status !== 'all' ? 'Tidak ada project yang cocok dengan pencarian atau filter.' : <>Belum ada project.<br />Gambar sesuatu, lalu tekan Simpan ke Project.</>}
        </div>
      )}
      {data && data.length > 0 && (
        <div className="grid">
          {data.map((p) => (
            <button key={p.id} className="card item" onClick={() => onOpen(p.id)}>
              {p.thumb ? <img src={p.thumb} alt="" /> : <div className="noimg" />}
              <div>
                <b>{p.title}</b><br />
                <small>oleh {p.author}</small><br />
                <small>{fmt(p.created_at)}</small><br />
                <span className={`badge b-${p.status}`}>{ST[p.status]}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
