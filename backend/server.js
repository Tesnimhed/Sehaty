import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import { setLanguage } from './middleware/setLanguage.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();
if (process.env.CLOUDINARY_CLOUD_NAME) connectCloudinary();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(setLanguage);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API Sehaty opérationnelle' });
});

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
