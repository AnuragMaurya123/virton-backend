import { Request, Response } from "express";
import { Promoter } from "../models/promoters.model";

// Get all promoters for the admin
export const getAdminPromoters = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all promoters from the database
    const promoters = await Promoter.find({});

    if (!promoters) throw new Error("Data not found");

    // Set the response with promoters' data
    res
      .status(201)
      .json({
        message: "Admin created successfully", // Message response
        promoters, // Sending promoters data in the response
      });
  } catch (error) {
    console.log(error);
  }
};
