import { api } from '../config/api.js';

export const templateService = {
  list: () => api.get('/templates').then((r) => r.data),
  get: (id) => api.get(`/templates/${id}`).then((r) => r.data),
  create: (body) => api.post('/templates', body).then((r) => r.data),
  remove: (id) => api.delete(`/templates/${id}`).then((r) => r.data),
};
