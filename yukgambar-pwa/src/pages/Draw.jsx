import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { drawTemplate } from '../lib/templates.js';
import { DEFAULT_AUTHOR, flatten, floodFill, savePng, thumbOf } from '../lib/canvas.js';
import { projectService } from '../services/projectService.js';
import SaveDialog from '../components/SaveDialog.jsx';
import SizeDialog from '../components/SizeDialog.jsx';

const DRAFT = 'yukgambar-draft';
// [label, ukuran awal]
const TOOLS = { pencil: ['Pensil', 3], pen: ['Spidol', 6], marker: ['Stabilo', 26], eraser: ['Penghapus', 24], fill: ['Cat', 0] };

export default function Draw({ editing, onEditingChange, tpl, notify }) {
  const bg = useRef(), cv = useRef();
  const pending = useRef(null); // gambar yang harus digambar ulang setelah kanvas berubah ukuran
  const hist = useRef({ undo: [], redo: [] });
  const drawing = useRef(false), last = useRef(null);
  const [dim, setDim] = useState({ w: 1200, h: 800 });
  const [rev, setRev] = useState(0);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#241f4a');
  const [size, setSize] = useState(6);
  const [dlg, setDlg] = useState(null); // 'create' | 'update' | 'new'
  const [sizeOpen, setSizeOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [, tick] = useState(0);
  const { w: W, h: H } = dim;
  const ctx = () => cv.current.getContext('2d');

  // Mengubah width/height canvas menghapus isinya, jadi latar & gambar digambar ulang di sini
  useLayoutEffect(() => {
    drawTemplate(bg.current.getContext('2d'), W, H, tpl);
    if (pending.current) {
      const c = ctx();
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.clearRect(0, 0, W, H);
      c.drawImage(pending.current, 0, 0);
      pending.current = null;
      tick((n) => n + 1);
    }
  }, [tpl, W, H, rev]);

  // Muat gambar ke kanvas dengan ukuran aslinya
  const loadImage = (src) => {
    const im = new Image();
    im.onload = () => {
      pending.current = im;
      hist.current = { undo: [], redo: [] };
      setDim({ w: im.width, h: im.height });
      setRev((n) => n + 1);
    };
    im.src = src;
  };

  // Pulihkan draft terakhir (localStorage) saat aplikasi dibuka
  useEffect(() => {
    if (editing) return;
    try {
      const d = localStorage.getItem(DRAFT);
      if (d) loadImage(d);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Muat project yang akan diedit (ukuran kanvas mengikuti gambar tersimpan)
  useEffect(() => {
    if (editing?.image_data) loadImage(editing.image_data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id]);

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT, cv.current.toDataURL('image/png'));
    } catch {}
  };

  const snap = () => {
    const h = hist.current;
    h.undo.push(ctx().getImageData(0, 0, W, H));
    const limit = Math.max(5, Math.floor(6e7 / (W * H * 4))); // batasi memori riwayat ±60 MB
    while (h.undo.length > limit) h.undo.shift();
    h.redo = [];
    tick((n) => n + 1);
  };
  const undo = () => {
    const h = hist.current;
    if (!h.undo.length) return;
    h.redo.push(ctx().getImageData(0, 0, W, H));
    ctx().putImageData(h.undo.pop(), 0, 0);
    tick((n) => n + 1);
    saveDraft();
  };
  const redo = () => {
    const h = hist.current;
    if (!h.redo.length) return;
    h.undo.push(ctx().getImageData(0, 0, W, H));
    ctx().putImageData(h.redo.pop(), 0, 0);
    tick((n) => n + 1);
    saveDraft();
  };
  const fn = useRef({});
  fn.current = { undo, redo };

  // Pintasan keyboard Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); fn.current.undo(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); fn.current.redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const resize = (w, h) => {
    setSizeOpen(false);
    if (w === W && h === H) return;
    const keep = document.createElement('canvas');
    keep.width = W;
    keep.height = H;
    keep.getContext('2d').drawImage(cv.current, 0, 0);
    pending.current = keep;
    hist.current = { undo: [], redo: [] };
    setDim({ w, h });
    notify(`Ukuran kanvas: ${w}×${h}`);
  };

  const pos = (e) => {
    const r = cv.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  };
  const seg = (a, b) => {
    const c = ctx();
    c.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    c.globalAlpha = tool === 'marker' ? 0.45 : tool === 'pencil' ? 0.8 : 1;
    c.strokeStyle = color;
    c.lineWidth = size * 2;
    c.lineCap = tool === 'marker' ? 'square' : 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.stroke();
  };

  const down = (e) => {
    snap();
    const p = pos(e);
    if (tool === 'fill') {
      floodFill(bg.current, cv.current, p.x, p.y, color);
      saveDraft();
      return;
    }
    drawing.current = true;
    cv.current.setPointerCapture(e.pointerId);
    last.current = p;
    seg(p, { x: p.x + 0.01, y: p.y });
  };
  const move = (e) => {
    if (!drawing.current) return;
    const p = pos(e);
    seg(last.current, p);
    last.current = p;
  };
  const up = () => {
    if (drawing.current) saveDraft();
    drawing.current = false;
  };

  const pick = (k) => {
    setTool(k);
    if (TOOLS[k][1]) setSize(TOOLS[k][1]);
  };
  const clear = () => {
    snap();
    ctx().globalCompositeOperation = 'source-over';
    ctx().clearRect(0, 0, W, H);
    saveDraft();
  };
  const download = () => savePng(flatten(bg.current, cv.current), editing?.title || 'yukgambar');

  const save = async (form) => {
    setSaving(true);
    try {
      const flat = flatten(bg.current, cv.current);
      const body = {
        title: form.title,
        author: form.author,
        status: form.status,
        template_id: tpl,
        image_data: flat.toDataURL('image/jpeg', 0.8),
        thumb: thumbOf(flat),
      };
      const update = editing && dlg === 'update';
      const res = update ? await projectService.update(editing.id, body) : await projectService.create(body);
      notify(`${update ? 'Perubahan disimpan' : 'Tersimpan'}: ${res.title} (${form.status === 'done' ? 'Done' : 'In Progress'})`);
      onEditingChange(update ? { ...editing, ...res, image_data: body.image_data } : null);
      setDlg(null);
    } catch (e) {
      notify(e.message);
    } finally {
      setSaving(false);
    }
  };

  const h = hist.current;
  const initial = editing
    ? { title: editing.title, status: editing.status, author: editing.author }
    : { title: '', status: 'progress', author: DEFAULT_AUTHOR };

  return (
    <>
      <div className="bar">
        <div className="tools">
          {Object.entries(TOOLS).map(([k, [label]]) => (
            <button key={k} className={k === tool ? 'sel' : ''} onClick={() => pick(k)}>{label}</button>
          ))}
        </div>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Warna" />
        <label>
          Tebal <input type="range" min="2" max="36" value={size} onChange={(e) => setSize(+e.target.value)} />
          <b>{size}</b>px
        </label>
        <button className="bad" onClick={clear}>Hapus semua</button>
      </div>

      <div className="cw" style={{ aspectRatio: `${W} / ${H}`, maxWidth: `min(100%, ${((75 * W) / H).toFixed(1)}vh)` }}>
        <canvas ref={bg} width={W} height={H} />
        <canvas
          ref={cv}
          width={W}
          height={H}
          aria-label="Kanvas gambar"
          style={{ cursor: tool === 'fill' ? 'cell' : 'crosshair' }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />
      </div>

      {editing && (
        <div className="edit">
          Mengedit: <b>{editing.title}</b>
          <button onClick={() => onEditingChange(null)}>Selesai edit</button>
        </div>
      )}

      <div className="bar" style={{ marginTop: 12 }}>
        {editing ? (
          <>
            <button className="go" onClick={() => setDlg('update')}>Simpan perubahan</button>
            <button onClick={() => setDlg('new')}>Simpan sebagai baru</button>
          </>
        ) : (
          <button className="go" onClick={() => setDlg('create')}>Simpan ke Project</button>
        )}
      </div>
      <div className="bar" style={{ marginTop: 12 }}>
        <button onClick={undo} disabled={!h.undo.length} title="Undo (Ctrl+Z)">↶ Undo</button>
        <button onClick={redo} disabled={!h.redo.length} title="Redo (Ctrl+Y)">↷ Redo</button>
        <button onClick={download}>↓ Unduh PNG</button>
        <button onClick={() => setSizeOpen(true)} title="Ubah ukuran kanvas">⤢ Ukuran {W}×{H}</button>
      </div>

      {dlg && <SaveDialog mode={dlg} initial={initial} saving={saving} onCancel={() => setDlg(null)} onSubmit={save} />}
      {sizeOpen && <SizeDialog w={W} h={H} onCancel={() => setSizeOpen(false)} onApply={resize} />}
    </>
  );
}
