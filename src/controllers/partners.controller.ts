import { Request, Response } from "express";
import { Partner } from "../models/partners.model";

// Get all partners for the admin
export const getAdminPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all partners from the database
    const partners = await Partner.find({});

    if (!partners) throw new Error("Admin not found");

    // Set the response with partners' data
    res
      .status(201)
      .json({
        message: "Admin created successfully", // Message response
        partners, // Sending partners data in the response
      });
  } catch (error) {
    console.log(error);
  }
};
