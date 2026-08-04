import { Router } from "express";
import { analyzeProfile } from "../controllers/analyzeController.js";

const router = Router();

router.post("/analyze", analyzeProfile);

export default router;
