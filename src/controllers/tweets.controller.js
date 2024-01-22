import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getTweets = asyncHandler(
    async (req, res) => {}
)

const createTweet = asyncHandler(
    async (req, res) => {}
)

const updateTweet = asyncHandler(
    async (req, res) => {}
)

const deleteTweet = asyncHandler(
    async (req, res) => {}
)

export {
    getTweets,
    createTweet,
    updateTweet,
    deleteTweet
}