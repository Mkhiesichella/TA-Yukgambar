import { DEFAULT_AUTHOR } from '../lib/canvas.js';

export default function Profile() {
  return (
    <>
      <h2>Profil</h2>
      <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="avatar">M</div>
        <div>
          <div style={{ fontSize: 21, fontWeight: 600 }}>{DEFAULT_AUTHOR}</div>
          <div className="muted">NIM 21120124140122</div>
        </div>
      </div>
      <h2 style={{ marginTop: 20 }}>Tentang YukGambar</h2>
      <div className="card">
        <p style={{ marginTop: 0 }}>
          YukGambar adalah papan tulis digital untuk menggambar langsung di browser, lewat mouse maupun layar sentuh.
          Pilih pensil, spidol, stabilo, penghapus, atau cat isi warna, atur warna dan ketebalan garis, lalu mulai menggambar.
        </p>
        <p>
          Kalau gambar sudah jadi, beri judul dan status lalu simpan ke halaman <b>Project</b>. Dari sana kamu bisa
          membuka kembali, mengubah, mengunduh sebagai PNG, atau menghapusnya. Halaman <b>Template</b> menyediakan
          pilihan latar kertas seperti polos, bergaris, dan kotak-kotak.
        </p>
        <p style={{ marginBottom: 0 }} className="muted">
          Tugas Akhir Praktikum Pemrograman Perangkat Bergerak (PPB) 2026 — Progressive Web App (React + Vite) dengan
          REST API Express + Supabase.
        </p>
      </div>
    </>
  );
}
