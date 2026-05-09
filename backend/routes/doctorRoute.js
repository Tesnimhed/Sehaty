import express from 'express';
import {
  changeAvailability, doctorList, loginDoctor, appointmentsDoctor,
  appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile
} from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

// Routes publiques
doctorRouter.post('/connexion', loginDoctor);  // Auth médecin
doctorRouter.post('/login', loginDoctor);       // Alias compatibilité
doctorRouter.get('/list', doctorList);           // Liste publique médecins

// Routes protégées (dtoken requis)
doctorRouter.post('/change-availability', authDoctor, changeAvailability);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);

export default doctorRouter;
