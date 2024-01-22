import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const getLikes = asyncHandler(
    async (req, res)=>{
        try {
            const user = req.user?._id;
            if(!user){
                throw new ApiError(401, "user not found");
            }
            return res
            .status(200)
            .json(
                new ApiResponse(200, user, "lieks are fetched")
            );
        } catch (error) {
            
        }
    }
)
const updteLikes = asyncHandler(
    async (req, res)=>{
        try {
            const user = req.body;
            if(!user){
                throw new ApiError(401, "user not found");
            }
            return res
            .status(200)
            .json(
                new ApiResponse(200, user, "likes updated")
            );
        } catch (error) {
            throw new ApiError(401, "login first")
        }
    }
)


export {
    getLikes,
    updteLikes
}