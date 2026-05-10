import express from 'express';
import {
  addDoctor, loginAdmin, allDoctors, appointmentAdmin,
  appointmentCancel, adminDashboard, deleteDoctor,
  toggleDoctorAvailabilityAdmin, allPatients, deletePatient,
} from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const routeurAdmin = express.Router();

routeurAdmin.post('/connexion',           loginAdmin);
routeurAdmin.post('/ajouter-medecin',     authAdmin, upload.single('image'), addDoctor);
routeurAdmin.get('/liste-medecins',       authAdmin, allDoctors);
routeurAdmin.get('/liste-rendez-vous',    authAdmin, appointmentAdmin);
routeurAdmin.post('/annuler-rendez-vous', authAdmin, appointmentCancel);
routeurAdmin.get('/tableau-de-bord',      authAdmin, adminDashboard);
routeurAdmin.post('/supprimer-medecin',   authAdmin, deleteDoctor);
routeurAdmin.post('/toggle-disponibilite',authAdmin, toggleDoctorAvailabilityAdmin);
routeurAdmin.get('/liste-patients',       authAdmin, allPatients);
routeurAdmin.post('/supprimer-patient',   authAdmin, deletePatient);  // ✅ nouveau

export default routeurAdmin;