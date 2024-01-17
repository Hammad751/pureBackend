import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken";

const generate_Ref_Acc_Token = async (userId) => {
    try {
        const user = await User.findById(userId);
        const access_token = user.generateAccessToken();
        const refresh_token = user.generateRefershToken();

        user.refreshToken = refresh_token;
        await user.save({validateBeforeSave: false});

        return {access_token, refresh_token}
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens");
    }
}
const registerUser = asyncHandler (
    async (req, res) =>{
        console.log("body>>...", req.body);
        const {username, fullname, email, password} = req.body;

        if(
            [username, fullname, email, password].some((field) => field?.trim() === "")
        ){
            throw new ApiError(400, "All fields are required.");
        }
        const isExists = await User.findOne({
            $or: [{ username }, { email }]
        })

        if(isExists){
            throw new ApiError(409, "user already exists");
        }
        
        const avtLocalPath = req.files?.avatar[0]?.path;
        // const coverImgPath = req.files?.coverImage[0]?.path;
        
        console.log("request files: ",req.files);

        let coverImgPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImgPath = req.files.coverImage[0].path;
        }
        console.log("coverImgPath: ", coverImgPath);
        console.log("avtLocalPath", avtLocalPath);

        if(!avtLocalPath){
            throw new ApiError(400, "image file is required");
        }
        const avatar = await uploadFile(avtLocalPath);
        const coverImage = await uploadFile(coverImgPath);

        if(!avatar) throw new ApiError(400, "avatar is required");

        const user = await User.create({
            username: username.toLowerCase(),
            fullname,
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
        });

        const usercreated = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if(!usercreated) throw new ApiError(500, "something went wrong while creating user!!!");

        res.status(201).json(
            new ApiResponse(200, usercreated, "user created successfully")
        );
    }
);

const login = asyncHandler(
    async (req, res) =>{
        // user email/name, password
        // validation from db using refresh token and user inputs
        // profile upload
        // SEND cookies

        const {email, username, password} = req.body;
        if(!(username || email)){
            throw new ApiError(400, "username or email is required")
        }

        const isExists = await User.findOne({   
            $or: [{username},{email}]
        })
        if(!isExists){
            throw new ApiError(404, "user does not exist");
        }

        const isPassValid = await isExists.isValid(password);
        if(!isPassValid){
            throw new ApiError(401, "wrong credentials")
        }

        const {access_token, refresh_token} = await generate_Ref_Acc_Token(isExists._id);

        const loggedInUser = await User.findById(isExists._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
        }

        res
        .status(200)
        .cookie("access_token", access_token, options)
        .cookie("refresh_token", refresh_token, options)
        .json(
            new ApiResponse(200, 
                {
                    user: loggedInUser,access_token,refresh_token
                }, "user logged in successfully")
        );
    }
) 

const logout = asyncHandler(
    async (req, res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken: undefined
                },
            },
            {new: true}
        );
        const options = {
            httpOnly: true,
            secure: true,
        }

        return res
        .status(200)
        .clearCookie("access_token", options)
        .clearCookie("refresh_token", options)
        .json(new ApiResponse(200, {}, "user logout successfully"));
    }
)

const refreshAccessToken = asyncHandler(
    async (req, res) => {
        try {
            const incomingRefreshToken = req.cookies.refresh_token || req.body.refreshToken;

            if(!incomingRefreshToken){
                throw new ApiError(401, 'data not found');
            }

            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFERESH_TOKEN_SECRET
            )

            const user = await User.findById(decodedToken?._id);
            if(!user){
                throw new ApiError(401, "user not found");
            }

        } catch (error) {
            throw new ApiError(500, "something went wrong");
        }
    }
)

export {registerUser, login, logout};