// ============================================================
// userRoute.js — Routes du portail patient
// ============================================================

import express from 'express';
import {
  registerUser, verifyOtpAndCreate, loginUser, getProfile, updateProfile,
  bookAppointment, listAppointments, cancelAppointment,
  getNotifications, markNotificationRead,
  forgotPassword,   // ← nouveau
  resetPassword,    // ← nouveau
} from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';
import { createPaymentIntentForBooking, verifyAndBookAppointment } from '../controllers/paymentController.js';

const userRouter = express.Router();

// ── Routes publiques ────────────────────────────────────────
userRouter.post('/inscription', registerUser);
userRouter.post('/verifier-email', verifyOtpAndCreate);
userRouter.post('/connexion', loginUser);

// ── Réinitialisation mot de passe (publiques) ───────────────
userRouter.post('/mot-de-passe-oublie', forgotPassword);
userRouter.post('/reinitialiser-mot-de-passe', resetPassword);

// ── Routes protégées ────────────────────────────────────────
userRouter.get('/profil', authUser, getProfile);
userRouter.post('/mettre-a-jour-profil', authUser, upload.single('image'), updateProfile);

userRouter.post('/reserver-rendez-vous', authUser, bookAppointment);
userRouter.get('/liste-rendez-vous', authUser, listAppointments);
userRouter.post('/annuler-rendez-vous', authUser, cancelAppointment);

userRouter.post('/create-booking-intent', authUser, createPaymentIntentForBooking);
userRouter.post('/confirm-and-book', authUser, verifyAndBookAppointment);

userRouter.get('/notifications', authUser, getNotifications);
userRouter.post('/notifications/read', authUser, markNotificationRead);

export default userRouter;