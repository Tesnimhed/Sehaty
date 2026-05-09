import api from './axios.js'

export const adminApi = {
  login: (data) => api.post('/api/admin/connexion', data),
  addDoctor: (formData) =>
    api.post('/api/admin/ajouter-medecin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDoctors: () => api.get('/api/admin/liste-medecins'),
  getAppointments: () => api.get('/api/admin/liste-rendez-vous'),
  cancelAppointment: (appointmentId) =>
    api.post('/api/admin/annuler-rendez-vous', { appointmentId }),
  getDashboard: () => api.get('/api/admin/tableau-de-bord'),
  deleteDoctor: (docId) =>
    api.post('/api/admin/supprimer-medecin', { docId }),
  toggleAvailability: (docId) =>
    api.post('/api/admin/toggle-disponibilite', { docId }),
  getPatients: () => api.get('/api/admin/liste-patients'),
}
