import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Boolean, required: true },
    Phone: { type: String, required: true },
    Paid: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const Partner = mongoose.model("Partner", partnerSchema);
