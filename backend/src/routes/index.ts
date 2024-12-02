import { Router } from "express";
import { templateController } from "../controllers";

const router = Router();

router.get("/template", templateController);
export default router;
