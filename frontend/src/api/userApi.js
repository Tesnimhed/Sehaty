import api from './axios.js'

export const userApi = {
  register: (data) => api.post('/api/user/inscription', data),
  verifyEmail: (data) => api.post('/api/user/verifier-email', data),
  login: (data) => api.post('/api/user/connexion', data),
  getProfile: () => api.get('/api/user/profil'),
  updateProfile: (formData) =>
    api.post('/api/user/mettre-a-jour-profil', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  bookAppointment: (data) => api.post('/api/user/reserver-rendez-vous', data),
  getAppointments: () => api.get('/api/user/liste-rendez-vous'),
  cancelAppointment: (appointmentId) =>
    api.post('/api/user/annuler-rendez-vous', { appointmentId }),
  createBookingIntent: (data) =>
    api.post('/api/user/create-booking-intent', data),
  confirmAndBook: (data) => api.post('/api/user/confirm-and-book', data),
  getNotifications: () => api.get('/api/user/notifications'),
  markNotificationRead: (notificationId) =>
    api.post('/api/user/notifications/read', { notificationId }),
}
