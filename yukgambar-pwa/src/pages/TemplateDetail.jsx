import { templateService } from '../services/templateService.js';
import { useAsync } from '../hooks/useAsync.js';
import { ErrorBox, Loading } from '../components/State.jsx';
import TemplateThumb from '../components/TemplateThumb.jsx';

export default function TemplateDetail({ id, current, onBack, onUse }) {
  const { loading, error, data: t, retry } = useAsync(() => templateService.get(id), [id]);
  return (
    <>
      <button onClick={onBack}>‹ Kembali</button>
      {loading && <Loading text="Memuat detail…" />}
      {error && <ErrorBox message={error} onRetry={retry} />}
      {t && (
        <div className="detail card" style={{ marginTop: 12 }}>
          <TemplateThumb id={t.id} w={900} />
          <h2>{t.name}</h2>
          <p>{t.description}</p>
          <dl>
            <dt>Cocok untuk</dt><dd>{t.suitable_for}</dd>
            <dt>Status</dt><dd>{current === t.id ? 'Sedang dipakai' : 'Belum dipakai'}</dd>
          </dl>
          <button className="go" onClick={() => onUse(t.id, t.name)}>Pakai template ini</button>
        </div>
      )}
    </>
  );
}
