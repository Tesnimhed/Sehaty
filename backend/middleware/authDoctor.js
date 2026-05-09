// ============================================================
// authDoctor.js — Middleware d'authentification médecin
// ============================================================
// Vérifie le token JWT envoyé dans l'en-tête "dtoken".
// Si valide, injecte docId dans req.body pour les controllers.
// ============================================================

import jwt from 'jsonwebtoken';
import { t } from '../utils/i18n.js';

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken)
      return res.status(401).json({ success: false, message: t(req.lang, 'notAuthorized') });

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    // Attache l'ID médecin à req.body pour tous les controllers suivants
    req.body = req.body || {};
    req.body.docId = decoded.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: t(req.lang, 'notAuthorized') });
  }
};

export default authDoctor;
