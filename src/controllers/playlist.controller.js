import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";


const getPlayList = asyncHandler(
    async (req, res) => {}
)

const publishPlayList = asyncHandler(
    async (req, res) => {}
)

const updatePlayList = asyncHandler(
    async(req, rea) => {}
)
const deletePlayList = asyncHandler(
    async (req, res) => {}
)

export {
    getPlayList,
    publishPlayList,
    updatePlayList,
    deletePlayList
}