import { Router } from "express";
import { 
     login,
     logout, 
     registerUser, 
     refreshAccessToken,
     updatePassword,
     getcurrentUser,
     updateAccountDetails,
     updateAvatar,
     updateCoverImage,
     getUserChannelProfile,
     getWatchHistory
    } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        },
    ]),
    registerUser
);

router.route("/login").post(login);

// secured routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, updatePassword);
router.route("/current-user").get(verifyJWT, getcurrentUser);
router.route("/update-details").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").path(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/cover-image").path(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/hitory").get(verifyJWT, getWatchHistory);


export default router;