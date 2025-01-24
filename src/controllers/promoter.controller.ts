import { Request, Response } from "express";
import { Promoter } from "../models/promoters.model";


export const getAdminPromoters = async (req:Request, res: Response): Promise<void> => {
    try {
  
      const promoters = await Promoter.find({});
  
      if(!promoters) throw new Error("Data not found");
       // Set the cookie and send the response
       res
       .status(201)
       .json({
         message: "Admin created successfully",
         promoters, // Avoid exposing sensitive data
       });
      
    } catch (error) {
      console.log(error);
    }
  
  }
  