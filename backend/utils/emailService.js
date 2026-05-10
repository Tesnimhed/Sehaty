// ============================================================
// emailService.js — Service d'envoi d'emails (Brevo HTTP API)
// ============================================================
// Pas de SDK — fetch natif Node.js, 100% compatible ESM
// ============================================================

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async ({ to, name, subject, html }) => {
  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'Sehaty 🏥', email: process.env.EMAIL_USER },
      to: [{ email: to, name }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo error: ${res.status} — ${error}`);
  }
};

// ── Template de base (layout commun) ─────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sehaty</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; color: #1a202c; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
    .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 36px 40px; text-align: center; }
    .header-logo { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header-logo span { opacity: 0.7; font-weight: 400; font-size: 14px; display: block; margin-top: 4px; }
    .body { padding: 40px; }
    .footer { background: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 12px; line-height: 1.6; }
    .footer a { color: #2563eb; text-decoration: none; }
    h1 { font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
    p { font-size: 15px; color: #475569; line-height: 1.7; }
    .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-logo">
          🏥 Sehaty
          <span>Votre santé, simplifiée</span>
        </div>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        <p>
          Vous recevez cet email car vous avez créé un compte sur <a href="#">Sehaty</a>.<br/>
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br/>
          © ${new Date().getFullYear()} Sehaty — Algérie
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ── Template OTP ──────────────────────────────────────────────
const otpTemplate = (name, otp) => baseTemplate(`
  <h1>Vérification de votre adresse email</h1>
  <p style="margin-top: 8px;">Bonjour <strong>${name}</strong>,</p>
  <p style="margin-top: 12px;">
    Merci de vous être inscrit sur <strong>Sehaty</strong>. Pour finaliser la création de votre compte,
    veuillez entrer le code de vérification ci-dessous dans l'application.
  </p>

  <div style="margin: 32px 0; text-align: center;">
    <div style="display: inline-block; background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 2px dashed #93c5fd; border-radius: 16px; padding: 28px 48px;">
      <p style="font-size: 12px; color: #64748b; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">Code de vérification</p>
      <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #1d4ed8; font-family: 'Courier New', monospace;">${otp}</div>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 12px;">⏱ Valable pendant <strong style="color: #ef4444;">10 minutes</strong></p>
    </div>
  </div>

  <div class="divider"></div>

  <div style="background: #fefce8; border-left: 4px solid #fbbf24; border-radius: 0 8px 8px 0; padding: 16px; margin-top: 8px;">
    <p style="font-size: 13px; color: #78350f;">
      ⚠️ <strong>Sécurité :</strong> Ne partagez jamais ce code avec quelqu'un d'autre.
      Sehaty ne vous demandera jamais votre code par téléphone ou email.
    </p>
  </div>

  <p style="margin-top: 20px; font-size: 13px; color: #94a3b8;">
    Si vous n'avez pas demandé ce code, ignorez simplement cet email.
  </p>
`);

// ── Template Bienvenue ────────────────────────────────────────
const welcomeTemplate = (name) => baseTemplate(`
  <h1>Bienvenue sur Sehaty ! 🎉</h1>
  <p style="margin-top: 8px;">Bonjour <strong>${name}</strong>,</p>
  <p style="margin-top: 12px;">
    Votre compte a été créé avec succès. Vous pouvez dès maintenant accéder à tous les services Sehaty.
  </p>

  <div style="margin: 32px 0; display: grid; gap: 16px;">
    <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
      <span style="font-size: 24px;">📅</span>
      <div>
        <p style="font-weight: 700; color: #15803d; font-size: 14px;">Prise de rendez-vous</p>
        <p style="font-size: 13px; color: #4b5563; margin-top: 2px;">Réservez une consultation avec nos meilleurs spécialistes en quelques clics.</p>
      </div>
    </div>
    <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #eff6ff; border-radius: 12px; border: 1px solid #bfdbfe;">
      <span style="font-size: 24px;">🔔</span>
      <div>
        <p style="font-weight: 700; color: #1d4ed8; font-size: 14px;">Rappels automatiques</p>
        <p style="font-size: 13px; color: #4b5563; margin-top: 2px;">Recevez des notifications pour ne jamais manquer un rendez-vous.</p>
      </div>
    </div>
    <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #fdf4ff; border-radius: 12px; border: 1px solid #e9d5ff;">
      <span style="font-size: 24px;">🔒</span>
      <div>
        <p style="font-weight: 700; color: #7e22ce; font-size: 14px;">Données sécurisées</p>
        <p style="font-size: 13px; color: #4b5563; margin-top: 2px;">Vos informations médicales sont protégées et confidentielles.</p>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <div style="text-align: center; margin-top: 8px;">
    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
       style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; font-weight: 700; padding: 14px 36px; border-radius: 12px; text-decoration: none; font-size: 15px; letter-spacing: 0.3px;">
      Accéder à mon compte →
    </a>
  </div>
`);

// ── Fonctions d'envoi ─────────────────────────────────────────

/**
 * Envoie un email de vérification OTP
 */
export const sendOtpEmail = async (to, name, otp) => {
  await sendEmail({
    to, name,
    subject: `${otp} — Votre code de vérification Sehaty`,
    html: otpTemplate(name, otp),
  });
};

/**
 * Envoie un email de bienvenue après inscription confirmée
 */
export const sendWelcomeEmail = async (to, name) => {
  await sendEmail({
    to, name,
    subject: `Bienvenue sur Sehaty, ${name} !`,
    html: welcomeTemplate(name),
  });
};