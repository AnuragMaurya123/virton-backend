import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Admin } from "../models/admin.model";

export interface AuthenticatedRequest extends Request {
  admin?: { email: string }; // Custom property to hold admin data
}

export const verifyJwt = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies?._admintoken;     
 
      if (!token) {
        res.status(401).json({ error: "Not authenticated! Please log in." });
        return; 
      }
  
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
  
      const admin = await Admin.findOne({ email: decodedToken.email }).select("-password");
  
      if (!admin) {
        res.status(401).json({ error: "Invalid access token" });
        return; 
      }
  
      req.admin = { email: admin.email };
      next(); 
    } catch (error) {
      console.error("JWT verification error:", error);
      res.status(401).json({ error: "Authentication failed! Please try again." });
    }
  };
  
