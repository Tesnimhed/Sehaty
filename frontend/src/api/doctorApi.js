import api from './axios.js'

export const doctorApi = {
  login: (data) => api.post('/api/doctor/connexion', data),
  getList: () => api.get('/api/doctor/list'),
  changeAvailability: (docId) =>
    api.post('/api/doctor/change-availability', { docId }),
  getAppointments: () => api.get('/api/doctor/appointments'),
  completeAppointment: (docId, appointmentId) =>
    api.post('/api/doctor/complete-appointment', { docId, appointmentId }),
  cancelAppointment: (docId, appointmentId) =>
    api.post('/api/doctor/cancel-appointment', { docId, appointmentId }),
  getDashboard: () => api.get('/api/doctor/dashboard'),
  getProfile: () => api.get('/api/doctor/profile'),
  updateProfile: (data) => api.post('/api/doctor/update-profile', data),
}
