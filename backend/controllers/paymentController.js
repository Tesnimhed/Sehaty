// ============================================================
// paymentController.js — Gestion des paiements Stripe
// ============================================================
// Ce contrôleur gère 3 opérations critiques :
//  1. Créer un PaymentIntent (intention de paiement) pour un créneau
//  2. Vérifier le paiement et confirmer la réservation
//  3. Rembourser automatiquement lors d'une annulation
//
// Flux complet :
//   Frontend → createPaymentIntentForBooking (obtient clientSecret)
//   Frontend → Stripe.js confirmCardPayment (paiement carte)
//   Frontend → verifyAndBookAppointment (enregistre le RDV)
//   Annulation → refundAppointmentPayment (remboursement auto)
// ============================================================

import Stripe from 'stripe';
import appointmentModel from '../models/appointmentModel.js';
import notificationModel from '../models/notificationModel.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
import { t } from '../utils/i18n.js';

// ⚠️ Initialisation lazy de Stripe
// On ne crée PAS l'instance au chargement du module car dotenv.config()
// dans server.js n'a pas encore tourné à ce moment-là.
// La fonction getStripe() crée l'instance à la première utilisation,
// quand process.env.STRIPE_SECRET_KEY est déjà disponible.
let _stripe = null;
const getStripe = () => {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY manquant dans les variables d\'environnement (.env)');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
};

// ── 1. Créer un PaymentIntent ─────────────────────────────────
// Appelé AVANT le paiement pour préparer la transaction Stripe.
// Retourne un clientSecret que le frontend utilise pour déclencher
// la saisie de carte via Stripe.js.
const createPaymentIntentForBooking = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;

    // Récupère uniquement les honoraires du médecin (optimisation : select)
    const doctor = await doctorModel.findById(docId).select('fees slots_booked');
    if (!doctor) return res.status(404).json({ success: false, message: t(req.lang, 'doctorNotFound') });

    // Vérifie que le créneau est encore libre avant de lancer le paiement
    const slotsBooked = doctor.slots_booked || {};
    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.status(400).json({ success: false, message: t(req.lang, 'slotNotAvailable') });
    }

    // Création du PaymentIntent côté Stripe
    // amount est en centimes (ex: 2000 DZD → 200000)
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(doctor.fees * 100), // Stripe attend des centimes
      currency: 'dzd',                        // Dinar Algérien
      automatic_payment_methods: { enabled: true },
      // Métadonnées pour traçabilité en cas d'audit Stripe
      metadata: { docId, slotDate, slotTime }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret, // Transmis au frontend
      amount: doctor.fees
    });
  } catch (error) {
    console.error('❌ Erreur création PaymentIntent:', error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── 2. Vérifier le paiement et enregistrer la réservation ────
// Appelé APRÈS que Stripe.js a confirmé le paiement côté client.
// On vérifie l'état du PaymentIntent côté serveur (sécurité)
// avant d'enregistrer le rendez-vous en base.
const verifyAndBookAppointment = async (req, res) => {
  try {
    const { paymentIntentId, docId, slotDate, slotTime } = req.body;
    const userId = req.userId; // Injecté par le middleware authUser

    // ⚠️ Vérification côté serveur : ne jamais faire confiance au client
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Paiement non validé par Stripe' });
    }

    // Récupère les données du médecin et du patient
    const doctorData = await doctorModel.findById(docId);
    const userData = await userModel.findById(userId).select('-password');

    // Réserve le créneau dans les disponibilités du médecin
    const slotsBooked = doctorData.slots_booked || {};
    slotsBooked[slotDate] = slotsBooked[slotDate] || [];
    slotsBooked[slotDate].push(slotTime);

    // Crée le rendez-vous en base avec tous les détails du paiement
    const newAppointment = new appointmentModel({
      userId,
      docId,
      userData,
      docData: doctorData.toObject(), // Snapshot des données médecin au moment de la réservation
      amount: paymentIntent.amount / 100, // Reconvertit des centimes en DZD
      slotTime,
      slotDate,
      date: Date.now(),
      isPaid: true,                    // Marque comme payé
      paymentIntentId                  // Conserve l'ID pour le remboursement éventuel
    });

    await newAppointment.save();
    // Met à jour les créneaux réservés du médecin
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.status(201).json({ success: true, message: t(req.lang, 'appointmentBooked') });
  } catch (error) {
    console.error('❌ Erreur confirmation réservation:', error);
    res.status(500).json({ success: false, message: t(req.lang, 'serverError') });
  }
};

// ── 3. Remboursement automatique lors d'une annulation ───────
// Fonction utilitaire appelée par adminController et doctorController
// quand un RDV payé est annulé. Gère le remboursement Stripe et
// envoie une notification bilingue au patient.
const refundAppointmentPayment = async (appointment) => {
  try {
    // Conditions : le RDV doit être payé, avoir un PaymentIntentId,
    // et ne pas avoir déjà été remboursé
    if (!appointment.isPaid || !appointment.paymentIntentId || appointment.isRefunded) {
      return; // Rien à rembourser
    }

    console.log(`💳 Remboursement Stripe en cours pour le RDV ${appointment._id}...`);

    // Lance le remboursement via l'API Stripe (remboursement total par défaut)
    await getStripe().refunds.create({ payment_intent: appointment.paymentIntentId });

    // Met à jour le statut en base pour éviter un double remboursement
    await appointmentModel.findByIdAndUpdate(appointment._id, {
      isRefunded: true,
      isPaid: false
    });

    // Crée une notification bilingue (FR + AR) pour informer le patient
    await notificationModel.create({
      userId: appointment.userId,
      type: 'refund',
      // Message en français
      message: `Votre rendez-vous du ${appointment.slotDate} a été annulé. Le montant de ${appointment.amount} DZD vous a été remboursé.`,
      // Message en arabe
      messageAr: `تم إلغاء موعدك يوم ${appointment.slotDate}. المبلغ ${appointment.amount} DZD تم استرداده.`,
      amount: appointment.amount,
      isRead: false,
      relatedId: appointment._id
    });

    console.log(`✅ Remboursement de ${appointment.amount} DZD effectué.`);
  } catch (error) {
    // On log l'erreur sans bloquer l'annulation du RDV
    console.error('❌ Erreur lors du remboursement Stripe:', error);
  }
};

export { createPaymentIntentForBooking, verifyAndBookAppointment, refundAppointmentPayment };
