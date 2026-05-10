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

const allowedOrigins = [
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    console.log("CORS BLOCKED:", origin)
    return callback(null, true) // temporairement permissif pour debug
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','atoken','dtoken','utoken','token'],
}))

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
