import { useState } from 'react';
import { templateService } from '../services/templateService.js';
import { useAsync } from '../hooks/useAsync.js';
import { ErrorBox, Loading } from '../components/State.jsx';
import TemplateThumb from '../components/TemplateThumb.jsx';
import TemplateUpload from '../components/TemplateUpload.jsx';

export default function Templates({ onOpen, notify }) {
  const { loading, error, data, retry } = useAsync(() => templateService.list(), []);
  const [adding, setAdding] = useState(false);

  return (
    <>
      <h2>Template</h2>
      <div className="muted">Pilih latar kertas untuk kanvasmu, atau unggah gambarmu sendiri.</div>
      <div className="bar" style={{ marginTop: 12 }}>
        <button className="go" onClick={() => setAdding(true)}>+ Tambah template</button>
      </div>
      {loading && <Loading text="Memuat template…" />}
      {error && <ErrorBox message={error} onRetry={retry} />}
      {data && (
        <div className="grid">
          {data.map((t) => (
            <button key={t.id} className="card item" onClick={() => onOpen(t.id)}>
              {t.thumb ? <img src={t.thumb} alt="" /> : <TemplateThumb id={t.id} />}
              <div>
                <b>{t.name}</b><br />
                <small>{t.tagline}</small>
                {t.is_custom && <><br /><span className="badge b-custom">Buatanmu</span></>}
              </div>
            </button>
          ))}
        </div>
      )}
      {adding && (
        <TemplateUpload
          onCancel={() => setAdding(false)}
          onCreated={(t) => {
            setAdding(false);
            notify(`Template "${t.name}" ditambahkan`);
            retry();
          }}
        />
      )}
    </>
  );
}
