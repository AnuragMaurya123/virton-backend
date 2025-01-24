import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/admin.model";
import jwt from "jsonwebtoken";
import { Partner } from "../models/partners.model";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  
  try {
    if (!email) {
      res.status(400).json({ error: "Email is required" });
    }

    if (!password && password.length < 5){
      res.status(400).json({ error: "Password should be minimum 5 characters" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin){
      res.status(400).json({ error: "Invalid Email Found" });
      throw new Error("Invalid Email Found");
    } 

    const isPasscorrect =await bcrypt.compare(password, admin.password);
    

    if (!isPasscorrect) throw new Error("Password Incorrect");

    const token = jwt.sign(
      { email: admin.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10d",
      }
    );

    res
      .cookie("_admintoken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3,
      })
      .status(201)
      .json({
        message: "Login successfully",
        admin:{
          _id:admin._id,
          name:admin.name,
          email:admin.email,
          businessPromoters:admin.businessPromoters,
          businessIncome:admin.businessIncome,
          businessPartners:admin.businessPartners,
        }, 
        token
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const {
    email,
    password,
    name,
    businessPromoters,
    businessIncome,
    businessPartners,
  } = req.body;

  try {
    // Check if the admin already exists
    const exist = await Admin.findOne({ email });
    if (exist) {
       res.status(400).json({ error: "Email already exists" });
    }

    // Validate password length
    if (password.length < 6) {
       res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const salt =await bcrypt.genSaltSync(8);
    const hashPassword =await bcrypt.hashSync(password, salt);

    // Create a new admin entry
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


