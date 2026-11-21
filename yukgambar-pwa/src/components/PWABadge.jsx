import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWABadge() {
  const {
    offlineReady: [offline, setOffline],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const [installEvt, setInstallEvt] = useState(null);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallEvt(e);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!offline && !needRefresh && !installEvt) return null;
  const close = () => {
    setOffline(false);
    setNeedRefresh(false);
    setInstallEvt(null);
  };

  return (
    <div className="pwa" role="status">
      {needRefresh ? (
        <>
          <span>Versi baru tersedia.</span>
          <button className="go" onClick={() => updateServiceWorker(true)}>Muat ulang</button>
        </>
      ) : offline ? (
        <span>Siap dipakai offline.</span>
      ) : (
        <>
          <span>Pasang YukGambar di perangkatmu.</span>
          <button
            className="go"
            onClick={async () => {
              installEvt.prompt();
              await installEvt.userChoice;
              setInstallEvt(null);
            }}
          >
            Install
          </button>
        </>
      )}
      <button onClick={close}>Tutup</button>
    </div>
  );
}
