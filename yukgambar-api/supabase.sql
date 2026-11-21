-- Jalankan di Supabase: SQL Editor -> New query -> Run

create table if not exists public.templates (
  id          int primary key,
  name        text not null,
  tagline     text not null,
  description text not null,
  suitable_for text not null
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text not null default 'Muhammad Khiesichella Putra Yudanto',
  status      text not null default 'progress' check (status in ('progress','done')),
  template_id int  not null default 1 references public.templates(id),
  image_data  text not null,   -- gambar penuh (data URL JPEG)
  thumb       text,            -- thumbnail kecil untuk daftar
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_created_idx on public.projects (created_at desc);

insert into public.templates (id, name, tagline, description, suitable_for) values
 (1,'Kertas Polos','Putih bersih','Latar putih tanpa garis untuk menggambar bebas.','Sketsa bebas, ilustrasi, coret-coretan'),
 (2,'Kertas Bergaris','Garis mendatar','Garis mendatar yang rapi sebagai pemandu tulisan tangan.','Catatan, tulisan tangan, daftar'),
 (3,'Kotak-kotak','Grid kotak','Kotak-kotak seperti buku matematika untuk menjaga proporsi.','Diagram, tabel, desain sederhana'),
 (4,'Titik-titik','Dot grid','Titik-titik halus yang memandu tanpa mengganggu gambar.','Bullet journal, wireframe, sketsa teknis'),
 (5,'Kertas Krem','Warna hangat','Latar krem lembut yang nyaman dipandang lama.','Menggambar santai, lettering, ilustrasi')
on conflict (id) do nothing;

-- Izinkan akses lewat anon key (untuk tugas praktikum).
-- Jika memakai service_role key di backend, bagian RLS ini boleh dilewati.
alter table public.projects  enable row level security;
alter table public.templates enable row level security;
create policy "projects_all"  on public.projects  for all using (true) with check (true);
create policy "templates_read" on public.templates for select using (true);
