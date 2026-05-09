// ============================================================
// userRoute.js — Routes du portail patient
// ============================================================
// Les routes publiques ne nécessitent pas de token JWT.
// Les routes protégées passent par le middleware authUser qui
// vérifie le token et injecte userId dans req.body.
// ============================================================

import express from 'express';
import {
  registerUser, verifyOtpAndCreate, loginUser, getProfile, updateProfile,
  bookAppointment, listAppointments, cancelAppointment,
  getNotifications, markNotificationRead
} from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';
import { createPaymentIntentForBooking, verifyAndBookAppointment } from '../controllers/paymentController.js';

const userRouter = express.Router();

// ── Routes publiques (pas de token requis) ────────────────────
userRouter.post('/inscription', registerUser);          // Étape 1 : envoi OTP
userRouter.post('/verifier-email', verifyOtpAndCreate); // Étape 2 : vérifie OTP + crée compte
userRouter.post('/connexion', loginUser);                // Se connecter

// ── Routes protégées (token JWT requis) ───────────────────────

// Profil
userRouter.get('/profil', authUser, getProfile);
userRouter.post('/mettre-a-jour-profil', authUser, upload.single('image'), updateProfile);

// Rendez-vous (sans paiement — conservé pour compatibilité)
userRouter.post('/reserver-rendez-vous', authUser, bookAppointment);
userRouter.get('/liste-rendez-vous', authUser, listAppointments);
userRouter.post('/annuler-rendez-vous', authUser, cancelAppointment);

// ── Paiement Stripe (flux en 2 étapes) ───────────────────────
// Étape 1 : Crée un PaymentIntent → retourne clientSecret au frontend
userRouter.post('/create-booking-intent', authUser, createPaymentIntentForBooking);
// Étape 2 : Vérifie le paiement Stripe et enregistre le RDV
userRouter.post('/confirm-and-book', authUser, verifyAndBookAppointment);

// Notifications
userRouter.get('/notifications', authUser, getNotifications);
userRouter.post('/notifications/read', authUser, markNotificationRead);

export default userRouter;
