import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    businessPromoters: { type: Number, required: true },
    businessIncome: { type: Number, required: true },
    businessPartners: { type: Number, required: true },
    password:{type: String,required: true},
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
