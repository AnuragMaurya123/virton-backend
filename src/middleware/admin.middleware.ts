import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Admin } from "../models/admin.model";

export interface AuthenticatedRequest extends Request {
  admin?: { email: string }; // Custom property to hold admin data
}

// Middleware to verify the JWT token
export const verifyJwt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the token from cookies
    const token = req.cookies?.admintoken;     

    if (!token) {
      res.status(401).json({ error: "Not authenticated! Please log in." });
      return; 
    }

    // Verify the token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Find the admin by email from the decoded token
    const admin = await Admin.findOne({ email: decodedToken.email }).select("-password");

    if (!admin) {
      res.status(401).json({ error: "Invalid access token" });
      return; 
    }

    // Attach the admin data to the request object
    req.admin = { email: admin.email };
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ error: "Authentication failed! Please try again." });
  }
};
