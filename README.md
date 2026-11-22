# YukGambar — Tugas Akhir PPB 2026

Papan tulis digital (PWA) dengan REST API sendiri.
Penyusun: Muhammad Khiesichella Putra Yudanto — NIM 21120124140122

Isi repo (upload sebagai **dua repositori GitHub terpisah**):

| Folder | Isi | Referensi modul |
|---|---|---|
| `yukgambar-api/` | Express + Supabase (REST API) | Modul 1 |
| `yukgambar-pwa/` | React + Vite + vite-plugin-pwa + Axios | Modul 4 & 5 |

## 1. Siapkan Supabase
1. Buat project di https://supabase.com.
2. Buka **SQL Editor → New query**, tempel isi `yukgambar-api/supabase.sql`, klik **Run**.
   (Membuat tabel `projects` + `templates` dan mengisi 5 template.)
3. Ambil **Project URL** dan **anon public key** di *Project Settings → API*.

## 2. Jalankan backend (lokal)
```bash
cd yukgambar-api
cp .env.example .env      # isi SUPABASE_URL dan SUPABASE_KEY
npm install
npm run dev               # http://localhost:5000
```
Uji di Postman / browser:

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/projects?search=&status=progress\|done&sort=new\|old` | Daftar project |
| GET | `/api/projects/:id` | Detail project (termasuk gambar penuh) |
| POST | `/api/projects` | Simpan project baru |
| PUT | `/api/projects/:id` | Ubah judul / status / gambar |
| DELETE | `/api/projects/:id` | Hapus project |
| GET | `/api/templates`, `/api/templates/:id` | Daftar & detail template |

Contoh body POST: `{"title":"Kucing","author":"Khiesi","status":"progress","template_id":1,"image_data":"data:image/jpeg;base64,...","thumb":"data:image/jpeg;base64,..."}`

## 3. Jalankan frontend (lokal)
```bash
cd yukgambar-pwa
cp .env.example .env      # VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```
Uji PWA / offline: `npm run build && npm run preview`, lalu buka DevTools → Application → Service Workers.

## 4. GitHub
Buat dua repo (mis. `yukgambar-api`, `yukgambar-pwa`), lalu di tiap folder:
```bash
git init && git add . && git commit -m "YukGambar"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```
`.env` sudah masuk `.gitignore` — jangan di-upload.

## 5. Deploy ke Vercel (gratis)
**Backend** — New Project → import repo `yukgambar-api` → Environment Variables: `SUPABASE_URL`, `SUPABASE_KEY` → Deploy.
Cek `https://<api>.vercel.app/` menjawab `{"name":"YukGambar API","status":"ok"}`.

**Frontend** — New Project → import repo `yukgambar-pwa` → preset **Vite** →
Environment Variables: `VITE_API_BASE_URL = https://<api>.vercel.app/api` → Deploy.
(Setelah mengubah variabel, lakukan **Redeploy**.)

## Upload template (opsional)
Jalankan `yukgambar-api/add-template-upload.sql` sekali di Supabase SQL Editor, lalu deploy ulang backend & frontend.

## Fitur
Kanvas dengan ukuran bisa diatur (preset + kustom), alat (pensil, spidol, stabilo, penghapus, cat isi warna), undo/redo (Ctrl+Z / Ctrl+Y), template latar (bawaan + unggah PNG/JPG sendiri),
simpan project (judul + status In Progress/Done + pembuat), edit & simpan perubahan, ubah judul/pembuat/status dari halaman detail, unduh PNG,
cari / urutkan / filter project, state loading & error dengan tombol "Coba lagi",
draft otomatis di localStorage, PWA (manifest, service worker, install, offline).

## Checklist syarat Tugas Akhir
- [x] API (web service) buatan sendiri — Express + Supabase
- [x] Bottom Navigation Bar (Gambar, Project, Template, Profil)
- [x] Minimal 5 halaman (Gambar, Project, Detail Project, Template, Detail Template, Profil = 6)
- [x] 2 halaman list yang itemnya membuka detail (Project, Template)
- [x] Halaman Profile/About
- [ ] Upload ke GitHub (lakukan sendiri)
- [ ] Deploy ke free hosting (lakukan sendiri)
- [ ] Isi judul, pilih asisten, asistensi minimal 1x

## Catatan
- Vercel membatasi body request fungsi ±4,5 MB. Gambar dikirim sebagai JPEG kualitas 0,8 (biasanya < 500 KB), jadi aman.
- Jangan pernah memakai `service_role` key di frontend. Di backend boleh (lewat environment variable).
