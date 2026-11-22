import { useState } from 'react';
import { templateService } from '../services/templateService.js';
import { useAsync } from '../hooks/useAsync.js';
import { ErrorBox, Loading } from '../components/State.jsx';
import TemplateThumb from '../components/TemplateThumb.jsx';

export default function TemplateDetail({ id, current, onBack, onUse, notify }) {
  const { loading, error, data: t, retry } = useAsync(() => templateService.get(id), [id]);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const remove = async () => {
    if (!confirm) return setConfirm(true);
    setBusy(true);
    try {
      await templateService.remove(id);
      notify('Template dihapus');
      onBack();
    } catch (e) {
      notify(e.message);
      setBusy(false);
    }
  };

  return (
    <>
      <button onClick={onBack}>‹ Kembali</button>
      {loading && <Loading text="Memuat detail…" />}
      {error && <ErrorBox message={error} onRetry={retry} />}
      {t && (
        <div className="detail card" style={{ marginTop: 12 }}>
          {t.image_data ? <img src={t.image_data} alt={t.name} /> : <TemplateThumb id={t.id} w={900} />}
          <h2>{t.name}</h2>
          <p>{t.description}</p>
          <dl>
            <dt>Cocok untuk</dt><dd>{t.suitable_for}</dd>
            <dt>Jenis</dt><dd>{t.is_custom ? 'Buatanmu (dari gambar unggahan)' : 'Bawaan'}</dd>
            <dt>Status</dt><dd>{current === t.id ? 'Sedang dipakai' : 'Belum dipakai'}</dd>
          </dl>
          <div className="bar">
            {t.is_custom ? (
              <>
                <button className="go" onClick={() => onUse(t, true)}>Pakai &amp; sesuaikan ukuran kanvas</button>
                <button onClick={() => onUse(t, false)}>Pakai di kanvas saat ini</button>
                <button className="bad" onClick={remove} disabled={busy}>{confirm ? 'Tekan lagi untuk menghapus' : 'Hapus'}</button>
              </>
            ) : (
              <button className="go" onClick={() => onUse(t, false)}>Pakai template ini</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
