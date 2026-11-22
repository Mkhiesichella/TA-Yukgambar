import { supabase } from '../config/supabase.js';

const LIST = 'id,name,tagline,description,suitable_for,is_custom,thumb';
const fail = (res, msg, code = 500) => res.status(code).json({ error: msg?.message || msg });

// GET /api/templates
export async function listTemplates(req, res) {
  const { data, error } = await supabase.from('templates').select(LIST).order('id');
  if (error) return fail(res, error);
  res.json(data);
}

// GET /api/templates/:id  (termasuk image_data untuk template buatan sendiri)
export async function getTemplate(req, res) {
  const { data, error } = await supabase.from('templates').select('*').eq('id', req.params.id).maybeSingle();
  if (error) return fail(res, error);
  if (!data) return fail(res, 'Template tidak ditemukan', 404);
  res.json(data);
}

// POST /api/templates  { name, description?, image_data, thumb? }
export async function createTemplate(req, res) {
  const { name, description, image_data, thumb } = req.body;
  if (!name?.trim() || !image_data) return fail(res, 'Nama dan gambar template wajib diisi', 400);
  if (!/^data:image\/(png|jpe?g|webp);base64,/.test(image_data)) {
    return fail(res, 'Format gambar harus PNG, JPG, atau WebP', 400);
  }
  if (image_data.length > 3_500_000) return fail(res, 'Gambar terlalu besar (maksimal ±2,5 MB)', 413);
  const row = {
    name: name.trim().slice(0, 60),
    tagline: 'Gambar sendiri',
    description: description?.trim().slice(0, 200) || 'Template dari gambar yang kamu unggah.',
    suitable_for: 'Latar gambar sendiri',
    image_data,
    thumb,
    is_custom: true,
  };
  const { data, error } = await supabase.from('templates').insert(row).select(LIST).single();
  if (error) return fail(res, error);
  res.status(201).json(data);
}

// DELETE /api/templates/:id  (hanya template buatan sendiri)
export async function deleteTemplate(req, res) {
  const { data, error } = await supabase
    .from('templates')
    .delete()
    .eq('id', req.params.id)
    .eq('is_custom', true)
    .select('id');
  if (error) return fail(res, error);
  if (!data?.length) return fail(res, 'Template tidak ditemukan atau merupakan template bawaan', 404);
  res.json({ message: 'Template berhasil dihapus' });
}
