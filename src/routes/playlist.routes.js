import { Router } from "express";
import { getPlayList, publishPlayList, updatePlayList, deletePlayList} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/viewList").get(verifyJWT,getPlayList);
router.route("/publishList").post(verifyJWT,publishPlayList);
router.route("/updateList").post(verifyJWT,updatePlayList);
router.route("/delete").delete(verifyJWT,deletePlayList);

export default router;
