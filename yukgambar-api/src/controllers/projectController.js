import { supabase } from '../config/supabase.js';

const LIST = 'id,title,author,status,template_id,thumb,created_at,updated_at';
const STATUS = ['progress', 'done'];
const fail = (res, msg, code = 500) => res.status(code).json({ error: msg?.message || msg });

// GET /api/projects?search=&status=&sort=new|old
export async function listProjects(req, res) {
  const { search = '', status, sort = 'new' } = req.query;
  let q = supabase.from('projects').select(LIST).order('created_at', { ascending: sort === 'old' });
  if (STATUS.includes(status)) q = q.eq('status', status);
  if (search.trim()) q = q.ilike('title', `%${search.trim()}%`);
  const { data, error } = await q;
  if (error) return fail(res, error);
  res.json(data);
}

// GET /api/projects/:id
export async function getProject(req, res) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', req.params.id).maybeSingle();
  if (error) return fail(res, error);
  if (!data) return fail(res, 'Project tidak ditemukan', 404);
  res.json(data);
}

// POST /api/projects
export async function createProject(req, res) {
  const { title, author, status = 'progress', template_id = 1, image_data, thumb } = req.body;
  if (!title?.trim() || !image_data) return fail(res, 'Judul dan data gambar wajib diisi', 400);
  if (!STATUS.includes(status)) return fail(res, 'Status harus progress atau done', 400);
  const row = { title: title.trim(), status, template_id, image_data, thumb };
  if (author?.trim()) row.author = author.trim();
  const { data, error } = await supabase.from('projects').insert(row).select(LIST).single();
  if (error) return fail(res, error);
  res.status(201).json(data);
}

// PUT /api/projects/:id
export async function updateProject(req, res) {
  const allowed = ['title', 'author', 'status', 'template_id', 'image_data', 'thumb'];
  const patch = Object.fromEntries(
    allowed.filter((k) => req.body[k] !== undefined).map((k) => [k, req.body[k]])
  );
  if (!Object.keys(patch).length) return fail(res, 'Tidak ada data yang diubah', 400);
  if (patch.status && !STATUS.includes(patch.status)) return fail(res, 'Status harus progress atau done', 400);
  if ('title' in patch && !String(patch.title).trim()) return fail(res, 'Judul tidak boleh kosong', 400);
  patch.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('projects').update(patch).eq('id', req.params.id).select(LIST).maybeSingle();
  if (error) return fail(res, error);
  if (!data) return fail(res, 'Project tidak ditemukan', 404);
  res.json(data);
}

// DELETE /api/projects/:id
export async function deleteProject(req, res) {
  const { data, error } = await supabase.from('projects').delete().eq('id', req.params.id).select('id');
  if (error) return fail(res, error);
  if (!data?.length) return fail(res, 'Project tidak ditemukan', 404);
  res.json({ message: 'Project berhasil dihapus' });
}
