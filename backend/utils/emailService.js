// ============================================================
// emailService.js — Service d'envoi d'emails (Resend)
// ============================================================

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Template de base (inchangé) ────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
... // garde exactement le même HTML qu'avant
`;

// ── Fonctions d'envoi ──────────────────────────────────────

export const sendOtpEmail = async (to, name, otp) => {
  await resend.emails.send({
    from: 'Sehaty 🏥 <noreply@ton-domaine.com>',  // ← domaine vérifié sur Resend
    to,
    subject: `${otp} — Votre code de vérification Sehaty`,
    html: otpTemplate(name, otp),
  });
};

export const sendWelcomeEmail = async (to, name) => {
  await resend.emails.send({
    from: 'Sehaty 🏥 <noreply@ton-domaine.com>',
    to,
    subject: `Bienvenue sur Sehaty, ${name} !`,
    html: welcomeTemplate(name),
  });
};