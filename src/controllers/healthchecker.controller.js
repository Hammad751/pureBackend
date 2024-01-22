import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const healthChecker = asyncHandler(
    async (req, res) => {
        
        try {
            return res.status(200).json(
                new ApiResponse(200,{}, "api called successfully")
            )
        } catch (error) {
            throw new ApiError(500, error?.message ||  "internal server error")
        }
    }
)

export default healthChecker;