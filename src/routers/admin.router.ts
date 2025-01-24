import express from "express";
import {  login, signup } from "../controllers/admin.controller";
import { verifyJwt } from "../middleware/admin.middleware";




const router = express.Router();

// POST route to handle form submission
router.post("/login", login);
router.post("/signup", signup);

export default router;