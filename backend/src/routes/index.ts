import { Router } from "express";
import { templateController, chatController } from "../controllers";

const router = Router();

router.post("/template", templateController);
router.post("/chat", chatController);
export default router;
