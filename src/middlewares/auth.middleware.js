import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(
    async (req, res, next) => {
        try {
            const token = req.cookies?.access_token ||
            req.header("Authorization")?.replace("Bearer ", "");

            if(!token){
                throw new ApiError(401, "Unauthorized access");
            }
    
            const decToken = jwt.verify(token, process.env.ACCESS_KEY);

            const user = await User.findById(decToken?.id).select(
                "-password -refreshToken"
            )

            if(!user){
                throw new ApiError(401, "invalid access token");
            }

            req.user = user;
            next();
        } catch (error) {
            throw new ApiError(401, error?.message || "something went wrong");
        }
    }
)