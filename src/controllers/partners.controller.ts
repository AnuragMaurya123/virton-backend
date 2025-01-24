import { Request, Response } from "express";
import { Partner } from "../models/partners.model";

export const getAdminPartner = async (req:Request, res: Response): Promise<void> => {
    try {
  
      const partners = await Partner.find({});
  
      if(!partners) throw new Error("Admin not found");
       // Set the cookie and send the response
       res
       .status(201)
       .json({
         message: "Admin created successfully",
         partners, // Avoid exposing sensitive data
       });
      
    } catch (error) {
      console.log(error);
    }
  
  }
  