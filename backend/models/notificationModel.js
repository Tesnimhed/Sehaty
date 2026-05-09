import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true }, // 'appointment', 'refund', etc.
  message: { type: String, required: true },
  messageAr: { type: String, default: null },
  relatedId: { type: String, default: null },
  data: { type: Object, default: null }, // { slotDate, slotTime, action }
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);