import Router from "express";
import healthChecker from "../controllers/healthchecker.controller.js";

const router = Router(); 

// healthChecker Assignment
router.route("/healthChecker").get(healthChecker);

export default router;