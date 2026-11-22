import { Router } from 'express';
import * as p from '../controllers/projectController.js';
import * as t from '../controllers/templateController.js';

// Tangkap error tak terduga supaya selalu menjawab JSON
const wrap = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((e) => res.status(500).json({ error: e.message }));

const r = Router();

r.get('/projects', wrap(p.listProjects));
r.get('/projects/:id', wrap(p.getProject));
r.post('/projects', wrap(p.createProject));
r.put('/projects/:id', wrap(p.updateProject));
r.delete('/projects/:id', wrap(p.deleteProject));

r.get('/templates', wrap(t.listTemplates));
r.get('/templates/:id', wrap(t.getTemplate));
r.post('/templates', wrap(t.createTemplate));
r.delete('/templates/:id', wrap(t.deleteTemplate));

export default r;
