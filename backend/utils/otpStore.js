// ============================================================
// otpStore.js — Stockage temporaire des codes OTP en mémoire
// ============================================================
// Stocke les OTP avec expiration (10 min) et limite les tentatives.
// Pour la production, remplacer par Redis ou MongoDB TTL.
// ============================================================

const store = new Map(); // email → { otp, name, password, expiresAt, attempts }

const OTP_TTL_MS = 10 * 60 * 1000;    // 10 minutes
const MAX_ATTEMPTS = 5;                 // tentatives max avant blocage

// ── Génère un code OTP à 6 chiffres ──────────────────────────
export const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

// ── Sauvegarde un OTP pour un email ──────────────────────────
export const saveOtp = (email, otp, name, hashedPassword) => {
  store.set(email.toLowerCase(), {
    otp,
    name,
    hashedPassword,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
};

// ── Vérifie un OTP ───────────────────────────────────────────
// Retourne : { valid: true, data } | { valid: false, reason }
export const verifyOtp = (email, inputOtp) => {
  const key = email.toLowerCase();
  const entry = store.get(key);

  if (!entry) return { valid: false, reason: 'not_found' };
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { valid: false, reason: 'expired' };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key);
    return { valid: false, reason: 'too_many_attempts' };
  }

  if (entry.otp !== inputOtp) {
    entry.attempts += 1;
    return { valid: false, reason: 'wrong_otp', attemptsLeft: MAX_ATTEMPTS - entry.attempts };
  }

  // OTP correct → on récupère les données et on nettoie
  const data = { name: entry.name, hashedPassword: entry.hashedPassword };
  store.delete(key);
  return { valid: true, data };
};

// ── Nettoyage périodique (toutes les 15 min) ─────────────────
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(key);
  }
}, 15 * 60 * 1000);
