import { useState } from 'react';
import { projectService } from '../services/projectService.js';
import { useAsync } from '../hooks/useAsync.js';
import { ErrorBox, Loading } from '../components/State.jsx';
import { dataUrlToCanvas, fmt, savePng } from '../lib/canvas.js';
import SaveDialog from '../components/SaveDialog.jsx';

const ST = { progress: 'In Progress', done: 'Done' };

export default function ProjectDetail({ id, onBack, onEdit, notify }) {
  const { loading, error, data, retry } = useAsync(() => projectService.get(id), [id]);
  const [over, setOver] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const p = data && { ...data, ...over };

  const toggle = async () => {
    setBusy(true);
    try {
      const next = p.status === 'done' ? 'progress' : 'done';
      const r = await projectService.update(id, { status: next });
      setOver({ status: r.status, updated_at: r.updated_at });
      notify(`Status: ${ST[r.status]}`);
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!confirm) return setConfirm(true);
    setBusy(true);
    try {
      await projectService.remove(id);
      notify('Project dihapus');
      onBack();
    } catch (e) {
      notify(e.message);
      setBusy(false);
    }
  };
  // Ubah judul / pembuat / status saja (tanpa menggambar ulang)
  const saveInfo = async (f) => {
    setBusy(true);
    try {
      const r = await projectService.update(id, { title: f.title, author: f.author, status: f.status });
      setOver({ title: r.title, author: r.author, status: r.status, updated_at: r.updated_at });
      notify('Info project diperbarui');
      setEditInfo(false);
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  };
  const png = async () => savePng(await dataUrlToCanvas(p.image_data), p.title);

  return (
    <>
      <button onClick={onBack}>‹ Kembali</button>
      {loading && <Loading text="Memuat detail…" />}
      {error && <ErrorBox message={error} onRetry={retry} />}
      {p && (
        <div className="detail card" style={{ marginTop: 12 }}>
          <img src={p.image_data} alt={p.title} />
          <h2>{p.title}</h2>
          <dl>
            <dt>Pembuat</dt><dd>{p.author}</dd>
            <dt>Dibuat</dt><dd>{fmt(p.created_at)}</dd>
            {p.updated_at && p.updated_at !== p.created_at && (<><dt>Diperbarui</dt><dd>{fmt(p.updated_at)}</dd></>)}
            <dt>Status</dt><dd><span className={`badge b-${p.status}`}>{ST[p.status]}</span></dd>
          </dl>
          <div className="bar">
            <button className="go" onClick={() => onEdit(p)}>Lanjut menggambar</button>
            <button onClick={() => setEditInfo(true)}>Ubah judul / info</button>
            <button onClick={png}>Unduh PNG</button>
            <button onClick={toggle} disabled={busy}>{p.status === 'done' ? 'Kembalikan ke In Progress' : 'Tandai Done'}</button>
            <button className="bad" onClick={remove} disabled={busy}>{confirm ? 'Tekan lagi untuk menghapus' : 'Hapus'}</button>
          </div>
        </div>
      )}
      {editInfo && p && (
        <SaveDialog
          mode="info"
          initial={{ title: p.title, status: p.status, author: p.author }}
          saving={busy}
          onCancel={() => setEditInfo(false)}
          onSubmit={saveInfo}
        />
      )}
    </>
  );
}
