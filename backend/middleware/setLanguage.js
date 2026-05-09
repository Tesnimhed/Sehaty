// ============================================================
// setLanguage.js — Middleware de détection de la langue
// ============================================================
// Lit l'en-tête Accept-Language et définit req.lang = 'fr' ou 'ar'.
// Utilisé par toutes les routes pour retourner des messages traduits.
// ============================================================

export const setLanguage = (req, res, next) => {
  const acceptLang = req.headers['accept-language'] || '';
  // Si l'en-tête contient 'ar', on utilise l'arabe, sinon le français par défaut
  req.lang = acceptLang.includes('ar') ? 'ar' : 'fr';
  next();
};
