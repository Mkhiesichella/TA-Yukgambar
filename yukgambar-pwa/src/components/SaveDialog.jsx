import { useEffect, useRef, useState } from 'react';

export default function SaveDialog({ mode, initial, saving, onCancel, onSubmit }) {
  const [f, setF] = useState(initial);
  const titleRef = useRef();

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return titleRef.current.focus();
    onSubmit({ ...f, title: f.title.trim(), author: f.author.trim() || initial.author });
  };

  return (
    <div className="back" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="dlgt">
        <h2 id="dlgt">{mode === 'info' ? 'Ubah info project' : mode === 'update' ? 'Simpan perubahan' : 'Simpan ke Project'}</h2>
        <label className="f">
          Judul gambar
          <input ref={titleRef} type="text" value={f.title} onChange={set('title')} placeholder="Contoh: Sketsa kucing" maxLength={60} />
        </label>
        <label className="f">
          Status
          <select value={f.status} onChange={set('status')}>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="f">
          Nama pembuat
          <input type="text" value={f.author} onChange={set('author')} maxLength={60} />
        </label>
        <div className="bar" style={{ justifyContent: 'flex-end', margin: '4px 0 0' }}>
          <button type="button" onClick={onCancel}>Batal</button>
          <button type="submit" className="go" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  );
}
