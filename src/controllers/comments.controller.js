import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addComment = asyncHandler(
    async (req, res) => {}
)

const checkComments = asyncHandler(
    async (req, res) =>{}
)

const updateComment = asyncHandler(
    async (req, res) =>{}
)

const deleteComment = asyncHandler(
    async (req, res) => {}
)


export {
    addComment,
    checkComments,
    updateComment,
    deleteComment
}