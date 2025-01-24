import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/admin.model";
import jwt from "jsonwebtoken";
import { Partner } from "../models/partners.model";

// Login function
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Validate if email and password are provided
    if (!email) {
      res.status(400).json({ error: "Email is required" });
    }

    if (!password || password.length < 5) {
      res.status(400).json({ error: "Password should be minimum 5 characters" });
    }

    // Check if the admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(400).json({ error: "Invalid Email Found" });
      throw new Error("Invalid Email Found");
    }

    // Compare password with stored hash
    const isPasscorrect = await bcrypt.compare(password, admin.password);

    if (!isPasscorrect) throw new Error("Password Incorrect");

    // Generate JWT token
    const token = jwt.sign(
      { email: admin.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );

    // Set the cookie with token and send response
    res
      .cookie("admintoken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        secure: process.env.NODE_ENV === "production", // HTTPS
        sameSite: "none", // Cross-origin support
      })
      .status(201)
      .json({
        message: "Login successfully",
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          businessPromoters: admin.businessPromoters,
          businessIncome: admin.businessIncome,
          businessPartners: admin.businessPartners,
        },
        token
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

// Signup function
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, businessPromoters, businessIncome, businessPartners } = req.body;

  try {
    // Check if admin already exists
    const exist = await Admin.findOne({ email });
    if (exist) {
      res.status(400).json({ error: "Email already exists" });
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSaltSync(8);
    const hashPassword = await bcrypt.hashSync(password, salt);

    // Create and save new admin
    const newAdmin = new Admin({
      email,
      name,
      businessPromoters,
      businessIncome,
      businessPartners,
      password: hashPassword,
    });
    const admin = await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { email: admin.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );

    // Set the cookie and send the response
    res
      .cookie("_admintoken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      })
      .status(201)
      .json({
        message: "Admin created successfully",
        admin, // Avoid exposing sensitive data
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
