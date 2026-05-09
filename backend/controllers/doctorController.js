// ============================================================
// doctorController.js — Actions du portail médecin
// ============================================================
// Gère : connexion, profil, liste des RDV, confirmation,
// annulation (avec remboursement auto), tableau de bord.
// ============================================================

import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import notificationModel from '../models/notificationModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { t } from '../utils/i18n.js';
import { refundAppointmentPayment } from './paymentController.js';

// ── Basculer la disponibilité du médecin ──────────────────────
// Toggle : disponible ↔ non disponible
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    if (!docData) return res.status(404).json({ success: false, message: t(req.lang, 'doctorNotFound') });

    const newStatus = !docData.available; // Inverse le statut actuel
    await doctorModel.findByIdAndUpdate(docId, { available: newStatus });

    res.status(200).json({ success: true, available: newStatus, message: t(req.lang, 'statusUpdated') });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Liste publique des médecins (pour les patients) ───────────
// N'expose pas le mot de passe ni l'email (données sensibles)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Connexion d'un médecin ────────────────────────────────────
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) return res.status(401).json({ success: false, message: t(req.lang, 'invalidCredentials') });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ success: false, message: t(req.lang, 'invalidCredentials') });

    // Le token médecin est identifié par req.headers.dtoken côté frontend
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Liste des RDV du médecin connecté ─────────────────────────
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body; // Injecté par authDoctor
    const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Marquer un RDV comme terminé ─────────────────────────────
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Vérifie que ce RDV appartient bien à ce médecin (sécurité)
    if (appointmentData && String(appointmentData.docId) === String(docId)) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.status(200).json({ success: true, message: t(req.lang, 'profileUpdated') });
    }
    res.status(400).json({ success: false, message: t(req.lang, 'markFailed') });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Annuler un RDV (médecin) + remboursement automatique ─────
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Vérifie que ce RDV appartient bien à ce médecin
    if (!appointmentData || String(appointmentData.docId) !== String(docId))
      return res.status(400).json({ success: false, message: t(req.lang, 'cancellationFailed') });

    // Marque le RDV comme annulé
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Libère le créneau dans le planning du médecin
    const { slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(time => time !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    // Remboursement automatique Stripe si le RDV était payé
    await refundAppointmentPayment(appointmentData);

    res.status(200).json({ success: true, message: t(req.lang, 'appointmentCancelled') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Tableau de bord médecin ───────────────────────────────────
// Calcule les revenus, le nombre de patients uniques, et les
// 5 derniers rendez-vous pour le dashboard du médecin.
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });

    // Calcul des revenus : uniquement les RDV complétés ou payés
    const earnings = appointments.reduce((total, appt) => {
      return (appt.isCompleted || appt.isPaid) ? total + appt.amount : total;
    }, 0);

    // Nombre de patients uniques (dédupliqué par userId)
    const uniquePatients = [...new Set(appointments.map(appt => String(appt.userId)))];

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: uniquePatients.length,
      latestAppointments: appointments.slice(0, 5)
    };

    res.status(200).json({ success: true, dashData });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Profil du médecin connecté ────────────────────────────────
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select('-password');
    res.status(200).json({ success: true, profileData });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Mise à jour du profil médecin ─────────────────────────────
// Seuls les champs modifiables par le médecin : honoraires,
// adresse, disponibilité. Pas de changement de mot de passe ici.
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.status(200).json({ success: true, message: t(req.lang, 'profileUpdated') });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

export {
  changeAvailability, doctorList, loginDoctor,
  appointmentsDoctor, appointmentComplete, appointmentCancel,
  doctorDashboard, doctorProfile, updateDoctorProfile
};
