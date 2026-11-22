import { useEffect, useState } from 'react';
import { readImageFile } from '../lib/canvas.js';
import { templateService } from '../services/templateService.js';

export default function TemplateUpload({ onCancel, onCreated }) {
  const [prep, setPrep] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) return setErr('Pilih file PNG, JPG, atau WebP.');
    if (f.size > 10_000_000) return setErr('File terlalu besar (maksimal 10 MB).');
    setErr('');
    try {
      setPrep(await readImageFile(f));
      if (!name) setName(f.name.replace(/\.[^.]+$/, '').slice(0, 40));
    } catch (ex) {
      setErr(ex.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!prep) return setErr('Pilih gambar dulu.');
    if (!name.trim()) return setErr('Isi nama template.');
    setBusy(true);
    setErr('');
    try {
      const t = await templateService.create({ name: name.trim(), description: desc, image_data: prep.image_data, thumb: prep.thumb });
      onCreated(t);
    } catch (ex) {
      setErr(ex.message);
      setBusy(false);
    }
  };

  return (
    <div className="back" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="tut">
        <h2 id="tut">Tambah template</h2>
        <label className="f">
          Gambar (PNG, JPG, WebP)
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pick} />
        </label>
        {prep && <img src={prep.thumb} alt="Pratinjau template" className="preview" />}
        <label className="f">
          Nama template
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Contoh: Halaman mewarnai kucing" />
        </label>
        <label className="f">
          Deskripsi (opsional)
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={200} />
        </label>
        {err && <small style={{ color: 'var(--danger)' }}>{err}</small>}
        <div className="bar" style={{ justifyContent: 'flex-end', margin: '4px 0 0' }}>
          <button type="button" onClick={onCancel}>Batal</button>
          <button type="submit" className="go" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan template'}</button>
        </div>
      </form>
    </div>
  );
}
