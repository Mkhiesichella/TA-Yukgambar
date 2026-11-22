import { useRef, useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import PWABadge from './components/PWABadge.jsx';
import Draw from './pages/Draw.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Templates from './pages/Templates.jsx';
import TemplateDetail from './pages/TemplateDetail.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  const [tab, setTab] = useState('draw');
  const [detail, setDetail] = useState(null); // id project / template yang dibuka
  const [editing, setEditing] = useState(null);
  const [tpl, setTpl] = useState({ id: 1, image: null, fit: false, nonce: 0 });
  const DEFAULT_TPL = { id: 1, image: null, fit: false, nonce: 0 };
  const [toast, setToast] = useState('');
  const timer = useRef();

  const notify = (m) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2600);
  };
  const go = (t) => {
    setTab(t);
    setDetail(null);
  };

  return (
    <div className="shell">
      <header>
        <h1>Yuk<span>Gambar</span></h1>
        <p>Gambar, simpan, lanjutkan.</p>
      </header>
      <main>
        {/* Halaman Gambar tetap terpasang agar kanvas tidak hilang saat pindah tab */}
        <section hidden={tab !== 'draw'}>
          <Draw editing={editing} onEditingChange={setEditing} tpl={tpl} notify={notify} />
        </section>

        {tab === 'project' &&
          (detail ? (
            <ProjectDetail
              id={detail}
              notify={notify}
              onBack={() => setDetail(null)}
              onEdit={(p) => {
                setEditing(p);
                setTpl(DEFAULT_TPL); // gambar tersimpan sudah memuat template di dalamnya
                go('draw');
                notify(`Mengedit: ${p.title}`);
              }}
            />
          ) : (
            <Projects onOpen={setDetail} />
          ))}

        {tab === 'template' &&
          (detail ? (
            <TemplateDetail
              id={detail}
              current={tpl.id}
              notify={notify}
              onBack={() => setDetail(null)}
              onUse={(t, fit) => {
                setTpl({ id: t.id, image: t.image_data || null, fit: !!fit, nonce: Date.now() });
                go('draw');
                notify(`${t.name} dipakai`);
              }}
            />
          ) : (
            <Templates onOpen={setDetail} notify={notify} />
          ))}

        {tab === 'profile' && <Profile />}
      </main>
      <PWABadge />
      <BottomNav tab={tab} onTab={go} />
      <div className={`toast${toast ? ' show' : ''}`} role="status">{toast}</div>
    </div>
  );
}
