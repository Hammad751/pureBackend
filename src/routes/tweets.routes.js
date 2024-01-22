import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTweets, updateTweet, createTweet, deleteTweet } from "../controllers/tweets.controller.js";
const router = Router();

router.route("/checktweets").get(verifyJWT ,getTweets);
router.route("/createTweets").post(verifyJWT ,createTweet);
router.route("/updateTweets").post(verifyJWT ,updateTweet);
router.route("/deleteTweets").get(verifyJWT ,deleteTweet);

export default router;