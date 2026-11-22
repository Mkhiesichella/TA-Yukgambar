-- Jalankan SEKALI di Supabase: SQL Editor -> New query -> Run
-- Menambah fitur "upload gambar sebagai template".

alter table public.templates add column if not exists image_data text;                       -- gambar penuh (data URL)
alter table public.templates add column if not exists thumb      text;                       -- thumbnail untuk daftar
alter table public.templates add column if not exists is_custom  boolean not null default false;

-- ID otomatis untuk template baru (template bawaan memakai 1-5)
create sequence if not exists public.templates_id_seq start 1000;
alter table public.templates alter column id set default nextval('public.templates_id_seq')::int;
grant usage, select on sequence public.templates_id_seq to anon, authenticated;

-- Kalau template dihapus, project yang memakainya kembali ke template 1 (Kertas Polos)
alter table public.projects drop constraint if exists projects_template_id_fkey;
alter table public.projects
  add constraint projects_template_id_fkey
  foreign key (template_id) references public.templates(id) on delete set default;

-- Izin: boleh menambah dan menghapus template buatan sendiri saja (template bawaan terlindungi)
drop policy if exists "templates_insert_custom" on public.templates;
create policy "templates_insert_custom" on public.templates for insert with check (is_custom = true);
drop policy if exists "templates_delete_custom" on public.templates;
create policy "templates_delete_custom" on public.templates for delete using (is_custom = true);
