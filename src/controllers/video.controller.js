import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
// import { User } from "../models/user.model";
import { uploadFile } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";


const getDuration = async (filePath) => {
    try {
        
    } catch (error) {
        throw new ApiError(400, "file path not found");
    }
}
const getAllVideos = asyncHandler(
    async (req, res) => {
        const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
        try {
            
        } catch (error) {
            throw new ApiError(400, "videos not found");
        }
    }
)

const updateVideo = asyncHandler(
    async (req, res) => {}
)

const publishVideo = asyncHandler(
    async (req, res) => {
        try {
            const {title, description} = req.body;
    
            let videoFilesPath;
            if(req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0){
                videoFilesPath = req.files.videoFile[0].path;
            }
    
            const videoFile = await uploadFile(videoFilesPath);
    
            if(!videoFile){
                throw new ApiError(400, "video not found");
            }

            const videoDuration = await getDuration(videoFilesPath);
    
            const thumbnailPath = req.files?.thumbnail[0]?.path;
    
            if(!thumbnailPath){
                throw new ApiError(400, "file is required");
            }
    
            const thumbnail = await uploadFile(thumbnailPath);
            if(!thumbnail) throw new ApiError(400, "thumbnail is required");
    
            // const id = await User.findById(req.user?._id);

            const userVideo = new Video({
                videoFile: videoFile.url,
                thumbnail: thumbnail.url,
                title,
                description,
                duration: 3,
                views: 0,
                isPublished: true,
                id
            });

            const videoSaved = await userVideo.save();
            // const usercreated = await Video.findById(userVideo._id).select(
            //     "-password -refreshToken"
            // );
    
            if(!videoSaved){
                throw new ApiError(400, "video not published");
            }
    
            return res
            .status(200)
            .json(
                new ApiResponse(200, videoSaved, "video uploaded successfully")
            );
        } catch (error) {
            throw new ApiError(400, "user not found");
        }
    }
)

const deleteVideo = asyncHandler(
    async (req, res) => {
        try {
            await Video.findByIdAndDelete(req.params._id);

            const options = {
                httpOnly: true,
                secure: true,
            }

            return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "video deleted")
            );
        } catch (error) {
            throw new ApiError(400, "video not found");
        }
    }
)

export {
    getAllVideos,
    updateVideo,
    publishVideo,
    deleteVideo
}