import { templateService } from '../services/templateService.js';
import { useAsync } from '../hooks/useAsync.js';
import { ErrorBox, Loading } from '../components/State.jsx';
import TemplateThumb from '../components/TemplateThumb.jsx';

export default function Templates({ onOpen }) {
  const { loading, error, data, retry } = useAsync(() => templateService.list(), []);
  return (
    <>
      <h2>Template</h2>
      <div className="muted">Pilih latar kertas untuk kanvasmu.</div>
      {loading && <Loading text="Memuat template…" />}
      {error && <ErrorBox message={error} onRetry={retry} />}
      {data && (
        <div className="grid">
          {data.map((t) => (
            <button key={t.id} className="card item" onClick={() => onOpen(t.id)}>
              <TemplateThumb id={t.id} />
              <div><b>{t.name}</b><br /><small>{t.tagline}</small></div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
