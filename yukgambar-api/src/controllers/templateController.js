import { supabase } from '../config/supabase.js';

// GET /api/templates
export async function listTemplates(req, res) {
  const { data, error } = await supabase.from('templates').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// GET /api/templates/:id
export async function getTemplate(req, res) {
  const { data, error } = await supabase.from('templates').select('*').eq('id', req.params.id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Template tidak ditemukan' });
  res.json(data);
}
