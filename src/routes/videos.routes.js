import { Router } from "express";
import { deleteVideo, getAllVideos, publishVideo, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/getVideos").get(getAllVideos);
router.route("/updateVideos").post(verifyJWT,
    upload.fields([
        {
            name: "userVideos",
            maxCount: 5
        }
    ]),
    updateVideo);
router.route("/publishVideos").post(verifyJWT, 
    upload.fields([
        {
            name: "userVideos",
            maxCount: 5
        }
    ])
    ,publishVideo);
router.route("/deleteVideos").delete(verifyJWT, deleteVideo);

export default router;