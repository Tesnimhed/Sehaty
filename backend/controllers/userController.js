// ============================================================
// userController.js — Actions du portail patient
// ============================================================
// Gère : inscription, connexion, profil, rendez-vous, notifications
// Toutes les réponses d'erreur sont traduites (FR/AR) via i18n.
// ============================================================

import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import notificationModel from '../models/notificationModel.js';
import { t } from '../utils/i18n.js';
import { sendOtpEmail, sendWelcomeEmail } from '../utils/emailService.js';
import { generateOtp, saveOtp, verifyOtp } from '../utils/otpStore.js';

// ── Étape 1 : Envoi de l'OTP par email ───────────────────────
// Valide les données, hache le mot de passe, envoie le code OTP.
// Le compte n'est PAS encore créé à cette étape.
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation des champs obligatoires
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: t(req.lang, 'missingDetails') });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: t(req.lang, 'invalidEmail') });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: t(req.lang, 'weakPassword') });

    // Vérification que l'email n'est pas déjà utilisé
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Cette adresse email est déjà utilisée.' });

    // Hachage anticipé du mot de passe (stocké temporairement avec l'OTP)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Génération et envoi de l'OTP
    const otp = generateOtp();
    saveOtp(email, otp, name, hashedPassword);

    await sendOtpEmail(email, name, otp);

    res.status(200).json({
      success: true,
      message: `Un code de vérification a été envoyé à ${email}.`,
    });
  } catch (error) {
    console.error('[registerUser]', error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Étape 2 : Vérification de l'OTP et création du compte ────
const verifyOtpAndCreate = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ success: false, message: t(req.lang, 'missingDetails') });

    const result = verifyOtp(email, otp);

    if (!result.valid) {
      const messages = {
        not_found: 'Aucune demande d\'inscription trouvée pour cet email. Recommencez l\'inscription.',
        expired: 'Le code a expiré. Veuillez recommencer l\'inscription.',
        too_many_attempts: 'Trop de tentatives incorrectes. Veuillez recommencer l\'inscription.',
        wrong_otp: `Code incorrect. Il vous reste ${result.attemptsLeft} tentative(s).`,
      };
      return res.status(400).json({ success: false, message: messages[result.reason] || 'Code invalide.' });
    }

    const { name, hashedPassword } = result.data;

    // Vérification finale que l'email n'a pas été pris entre-temps
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Cette adresse email est déjà utilisée.' });

    // Création du compte utilisateur
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    // Email de bienvenue (non bloquant)
    sendWelcomeEmail(email, name).catch(err => console.error('[welcomeEmail]', err));

    // Génération du JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, message: 'Compte créé avec succès !' });
  } catch (error) {
    console.error('[verifyOtpAndCreate]', error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Connexion d'un utilisateur existant ──────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche par email (index unique dans MongoDB)
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: t(req.lang, 'userNotExist') });

    // Comparaison du mot de passe avec le hash stocké
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: t(req.lang, 'invalidCredentials') });

    // Génération du JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Récupération du profil connecté ──────────────────────────
// userId est injecté par le middleware authUser (décodage JWT)
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    // select("-password") : exclut le mot de passe haché de la réponse
    const userData = await userModel.findById(userId).select('-password');
    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Mise à jour du profil (avec photo optionnelle) ────────────
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file; // Fichier uploadé via multer (optionnel)

    // Validation des champs requis (phone et dob sont optionnels)
    if (!name || !gender)
      return res.status(400).json({ success: false, message: t(req.lang, 'dataMissing') });

    // L'adresse peut arriver soit en string JSON soit déjà parsée
    const updateData = { name, gender };
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (address) updateData.address = typeof address === 'string' ? JSON.parse(address) : address;

    // Si une nouvelle image est uploadée, on l'envoie sur Cloudinary
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.status(200).json({ success: true, message: t(req.lang, 'profileUpdated') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Réservation d'un créneau (SANS paiement) ─────────────────
// Route conservée pour la compatibilité. La réservation AVEC paiement
// passe par paymentController (create-booking-intent + confirm-and-book).
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Vérification existence et disponibilité du médecin
    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData)
      return res.status(404).json({ success: false, message: t(req.lang, 'doctorNotFound') });
    if (!docData.available)
      return res.status(400).json({ success: false, message: t(req.lang, 'doctorNotAvailable') });

    // Vérification que le créneau n'est pas déjà pris
    const slotsBooked = docData.slots_booked || {};
    if (slotsBooked[slotDate]?.includes(slotTime))
      return res.status(400).json({ success: false, message: t(req.lang, 'slotNotAvailable') });

    // Réserve le créneau
    slotsBooked[slotDate] = slotsBooked[slotDate] || [];
    slotsBooked[slotDate].push(slotTime);

    // Snapshot des données au moment de la réservation (pour historique)
    const userData = await userModel.findById(userId).select('-password');
    const docInfo = docData.toObject();
    delete docInfo.slots_booked; // On n'a pas besoin des créneaux dans le snapshot

    // Enregistrement du RDV (isPaid: false = réservation sans paiement)
    const newAppointment = new appointmentModel({
      userId, docId, userData, docData: docInfo,
      amount: docData.fees, slotTime, slotDate, date: Date.now()
    });

    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.status(201).json({ success: true, message: t(req.lang, 'appointmentBooked') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Liste des rendez-vous du patient connecté ─────────────────
const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    // Tri par date décroissante (plus récent en premier)
    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Annulation d'un RDV par le patient ───────────────────────
// Note : le remboursement Stripe est géré séparément si le RDV
// a été payé (voir paymentController.refundAppointmentPayment)
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData)
      return res.status(404).json({ success: false, message: t(req.lang, 'appointmentNotFound') });

    // Sécurité : vérifie que le RDV appartient bien à cet utilisateur
    if (String(appointmentData.userId) !== String(userId))
      return res.status(401).json({ success: false, message: t(req.lang, 'unauthorizedAction') });

    // Marque le RDV comme annulé
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Libère le créneau dans le planning du médecin
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    res.status(200).json({ success: true, message: t(req.lang, 'appointmentCancelled') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Notifications du patient ──────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    // Tri par date de création décroissante (plus récent en premier)
    const notifications = await notificationModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Marquer une notification comme lue ───────────────────────
const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
 
    if (!email)
      return res.status(400).json({ success: false, message: t(req.lang, 'missingDetails') });
 
    // Vérifie que l'utilisateur existe
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ success: false, message: t(req.lang, 'userNotExist') });
 
    // Génère et stocke un OTP (réutilise saveOtp avec hashedPassword null)
    const otp = generateOtp();
    saveOtp(email.toLowerCase(), otp, user.name, null); // hashedPassword null car pas de création
 
    // Envoie l'OTP par email
    await sendOtpEmail(email, user.name, otp);
 
    return res.json({ success: true, message: t(req.lang, 'resetCodeSent') });
  } catch (error) {
    console.error('[forgotPassword]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
 
// ── Étape 2 : Vérification OTP + nouveau mot de passe ────────
// POST /api/user/reinitialiser-mot-de-passe
// Body : { email, otp, newPassword }
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
 
    if (!email || !otp || !newPassword)
      return res.status(400).json({ success: false, message: t(req.lang, 'missingDetails') });
 
    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: t(req.lang, 'weakPassword') });
 
    // Vérifie l'OTP
    const result = verifyOtp(email.toLowerCase(), otp);
 
    if (!result.valid) {
      if (result.reason === 'expired') {
        return res.status(400).json({ success: false, message: t(req.lang, 'otpExpired') });
      }
      return res.status(400).json({
        success: false,
        message: t(req.lang, 'otpInvalid'),
        attemptsLeft: result.attemptsLeft,
      });
    }
 
    // Hache le nouveau mot de passe et met à jour en base
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
 
    await userModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword }
    );
 
    return res.json({ success: true, message: t(req.lang, 'passwordResetSuccess') });
  } catch (error) {
    console.error('[resetPassword]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  verifyOtpAndCreate,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  getNotifications,
  markNotificationRead
};