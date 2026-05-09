// ============================================================
// authAdmin.js — Middleware d'authentification administrateur
// ============================================================
// Vérifie le token JWT envoyé dans l'en-tête "atoken".
// Contrôle que le payload contient bien role === 'admin'.
// ============================================================

import jwt from 'jsonwebtoken';
import { t } from '../utils/i18n.js';

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken)
      return res.status(401).json({ success: false, message: t(req.lang, 'notAuthorized') });

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // Vérification du rôle : seul 'admin' peut accéder aux routes admin
    if (decoded.role !== 'admin')
      return res.status(403).json({ success: false, message: t(req.lang, 'notAuthorized') });

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: t(req.lang, 'notAuthorized') });
  }
};

export default authAdmin;
