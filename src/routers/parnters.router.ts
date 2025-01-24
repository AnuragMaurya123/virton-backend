import express from "express";

import { verifyJwt } from "../middleware/admin.middleware";
import { getAdminPartner } from "../controllers/partners.controller";

const router = express.Router();

router.get("/getpartners",verifyJwt,getAdminPartner);

export default router;