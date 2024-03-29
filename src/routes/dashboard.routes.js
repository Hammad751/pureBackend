import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import getChannelStats from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/")
router.route("/channelStates").get(verifyJWT, getChannelStats);



export default router;