// ============================================================
// authUser.js — Middleware d'authentification patient
// ============================================================
// Vérifie le token JWT envoyé dans l'en-tête "token".
// Si valide, injecte userId dans req.body pour les controllers.
// ============================================================

import jwt from 'jsonwebtoken';
import { t } from '../utils/i18n.js';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    // Rejette les requêtes sans token
    if (!token)
      return res.status(401).json({ success: false, message: t(req.lang, 'notAuthorized') });

    // Décode et vérifie la signature du JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attache l'ID utilisateur à req.body pour tous les controllers suivants
    req.body = req.body || {};
    req.body.userId = decoded.id;
    req.userId = decoded.id; // Alias pratique pour paymentController

    next();
  } catch (error) {
    // Token invalide ou expiré
    console.error(error);
    res.status(401).json({ success: false, message: t(req.lang, 'notAuthorized') });
  }
};

export default authUser;
