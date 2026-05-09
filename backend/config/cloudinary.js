// ============================================================
// cloudinary.js — Configuration du stockage d'images
// ============================================================
// Cloudinary est utilisé pour stocker les photos de profil
// des médecins et des patients. Les identifiants sont lus
// depuis les variables d'environnement.
// ============================================================

import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configuré');
};

export default connectCloudinary;
