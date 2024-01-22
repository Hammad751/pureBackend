import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";
import {Likes} from "../models/likes.model.js";
import {Subscription} from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getChannelStats = asyncHandler(
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            console.log("user: ", user);

            if(!user){
                throw new ApiError(401, "User does not exist");
            }

            const {username} = req.params;
            const channel = await User.aggregate([
                {
                    $match: {
                        username: username?.toLowerCase()
                    }
                },
                {
                    $lookup:{
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "channel",
                        as: "subscribers"
                    }
                },
                {                    
                    $addFields:{
                        $totaSubscribers:{
                            $size: "$subscribers"
                        }
                    }
                },
                {
                    $project:{
                        totaSubscribers: 1
                    }
                }
            ])

            if(!channel?.length){
                throw new ApiError(401, "channel not found");
            }

            return res
            .status(200)
            .json(
                new ApiResponse(200, channel[0], "subscribrs get")
            );

            return res
            .status(200)
            .json(
                new ApiResponse(200, user, "getChannelStats mehtod called successfully...")
            );
        } catch (error) {
            throw new ApiError(401,"data not found");
        }
    }
)

export default getChannelStats;