import express from "express";

import { verifyJwt } from "../middleware/admin.middleware";
import { getAdminPromoters } from "../controllers/promoter.controller";


const router = express.Router();

router.get("/getpromoters",verifyJwt,getAdminPromoters);

export default router;