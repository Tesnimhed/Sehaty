// ============================================================
// adminController.js — Actions du panneau d'administration
// ============================================================

import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import notificationModel from '../models/notificationModel.js';
import { t } from '../utils/i18n.js';
import { refundAppointmentPayment } from './paymentController.js';

// ── Ajouter un médecin ────────────────────────────────────────
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address, available } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
      return res.status(400).json({ success: false, message: t(req.lang, 'missingDetails') });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: t(req.lang, 'invalidEmail') });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: t(req.lang, 'weakPassword') });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = '';
    if (imageFile) {
      try {
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: 'image',
          folder: 'sehaty/doctors',
          transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
        });
        imageUrl = uploadResult.secure_url;
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Erreur upload image' });
      } finally {
        if (imageFile.path && fs.existsSync(imageFile.path)) fs.unlinkSync(imageFile.path);
      }
    }

    const newDoctor = new doctorModel({
      name, email,
      image: imageUrl,
      password: hashedPassword,
      speciality, degree, experience, about, fees,
      address: typeof address === 'string' ? address : JSON.stringify(address),
      available: available === 'true' || available === true || available === 'on',
      date: Date.now()
    });

    await newDoctor.save();
    res.status(201).json({ success: true, message: t(req.lang, 'doctorAdded') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Connexion admin ───────────────────────────────────────────
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ success: true, token });
    }
    res.status(401).json({ success: false, message: t(req.lang, 'invalidCredentials') });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Liste médecins ────────────────────────────────────────────
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password');
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Liste rendez-vous ─────────────────────────────────────────
const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ date: -1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Annuler un RDV + remboursement ───────────────────────────
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData)
      return res.status(404).json({ success: false, message: t(req.lang, 'appointmentNotFound') });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    await refundAppointmentPayment(appointmentData);
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    if (!appointmentData.isPaid) {
      await notificationModel.create({
        userId: appointmentData.userId,
        type: 'appointment',
        message: `Votre rendez-vous du ${slotDate} a été annulé par l'administrateur.`,
        messageAr: `تم إلغاء موعدك يوم ${slotDate} من قبل المشرف.`,
        isRead: false,
        relatedId: appointmentId
      });
    }

    res.status(200).json({ success: true, message: t(req.lang, 'appointmentCancelled') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Tableau de bord ───────────────────────────────────────────
const adminDashboard = async (req, res) => {
  try {
    const [doctors, users, appointments] = await Promise.all([
      doctorModel.find({}).select('_id'),
      userModel.find({}).select('_id'),
      appointmentModel.find({}).sort({ date: -1 })
    ]);
    res.status(200).json({
      success: true,
      dashData: {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: appointments.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Supprimer un médecin ──────────────────────────────────────
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    await doctorModel.findByIdAndDelete(docId);
    res.status(200).json({ success: true, message: t(req.lang, 'profileUpdated') });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Basculer disponibilité médecin (admin) ────────────────────
const toggleDoctorAvailabilityAdmin = async (req, res) => {
  try {
    const { docId } = req.body;
    const doc = await doctorModel.findById(docId);
    if (!doc) return res.status(404).json({ success: false });
    await doctorModel.findByIdAndUpdate(docId, { available: !doc.available });
    res.status(200).json({ success: true, available: !doc.available });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── Liste patients ────────────────────────────────────────────
const allPatients = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

export {
  addDoctor, loginAdmin, allDoctors, appointmentAdmin,
  appointmentCancel, adminDashboard, deleteDoctor,
  toggleDoctorAvailabilityAdmin, allPatients
};
