import { api } from '../config/api.js';

export const projectService = {
  list: ({ search, status, sort } = {}) =>
    api
      .get('/projects', {
        params: {
          search: search || undefined,
          status: status && status !== 'all' ? status : undefined,
          sort,
        },
      })
      .then((r) => r.data),
  get: (id) => api.get(`/projects/${id}`).then((r) => r.data),
  create: (body) => api.post('/projects', body).then((r) => r.data),
  update: (id, body) => api.put(`/projects/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data),
};
