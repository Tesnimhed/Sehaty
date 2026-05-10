import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true, unique: true },
    password:{ type: String, required: true },
    image:   { type: String, default: "" },
    address: { type: Object, default: { line1: "", line2: "" } },
    gender:  { type: String, default: "Not Selected" },
    dob:     { type: String, default: "Not Selected" },
    phone:   { type: String, default: "0000000000" },

    // ── Vérification d'email ─────────────────────────────────
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    minimize: false,
    timestamps: true,   // ✅ ajoute createdAt et updatedAt automatiquement
  }
);

export default mongoose.model("user", userSchema);