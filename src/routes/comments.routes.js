import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {addComment, updateComment, checkComments, deleteComment} from "../controllers/comments.controller.js";


const router = Router();

router.route("/")
router.route("/checkComment").get(checkComments);
router.route("/addComment").post(verifyJWT, addComment);
router.route("/updateComment").post(verifyJWT, updateComment);
router.route("/deleteComment").delete(verifyJWT, deleteComment);



export default router;