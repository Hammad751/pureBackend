import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getLikes, updteLikes } from "../controllers/likes.controller.js";
const router = Router();

router.route("/checklikes").get(verifyJWT, getLikes);
router.route("/updatelikes").post(verifyJWT, updteLikes);

export default router;