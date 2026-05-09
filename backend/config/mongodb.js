// ============================================================
// mongodb.js — Connexion à MongoDB Atlas
// ============================================================
// Exporte une fonction qui établit la connexion via Mongoose.
// Appelée une seule fois au démarrage du serveur.
// ============================================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // mongoose.connection.on permet de logger les événements de connexion
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connecté');
    });
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB:', err);
    });

    // Connexion à l'URI défini dans les variables d'environnement
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('❌ Impossible de se connecter à MongoDB:', error);
    process.exit(1); // Arrête le serveur si la DB est inaccessible
  }
};

export default connectDB;
