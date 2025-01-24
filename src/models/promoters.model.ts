import mongoose from "mongoose";

const promoterSchema = new mongoose.Schema(
  {
    level: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);


export const Promoter = mongoose.model("Promoter", promoterSchema);
