import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

        let coverImgPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImgPath = req.files.coverImage[0].path;
        }

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

            console.log("decodedToken: ", decodedToken._id);
            const user = await User.findById(decodedToken?._id);
            if(!user){
                throw new ApiError(401, "user not found");
            }

            if(incomingRefreshToken !== user?.refreshToken){
                throw new ApiError(401, "Token is expired");
            }

            const options ={
                httpOnly: true,
                secure: true
            }
            const {access_token, refresh_token} = await generate_Ref_Acc_Token(user._id);

            return res
            .status(200)
            .cookie("access_token",access_token, options)
            .cookie("refresh_token", refresh_token, options)
            .json(
                new ApiResponse(
                200, 
                {access_token, refresh_token},
                "token generated successfully")
            );

        } catch (error) {
            throw new ApiError(401, error?.message || "something went wrong");
        }
    }
)

const updatePassword = asyncHandler(
    async (req, res)=>{
        try {
            const {oldPassword, newPassword} = req.body;
    
            const user = await User.findById(req.user?._id);
    
            if(!user){
                throw new ApiError(401, "user not found");
            }
    
            const currentPassword = await user.isValid(oldPassword);
    
            if(!currentPassword){
                throw new ApiError(400, "invalid password");
            }
    
            user.password = newPassword;
            await user.save({validateBeforeSave: false});
    
            return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "password updated")
            );
        } catch (error) {
            throw new ApiError(400, "wrong credentials");
        }
    }
)

const getcurrentUser = asyncHandler(
    async (req, res) => {
        try {
            return res
            .status(200)
            .json(200, req.user, "current user fetched");
        } catch (error) {
            throw new ApiError(500, "internal server error");
        }
    }
)

const updateAccountDetails = asyncHandler(
    async (req, res) => {
        try {
            const {fullname, email} = req.body;

            if(!fullname || !email){
                throw new ApiError(400, "both fields are required");
            }

            const userDetails = await User.findByIdAndUpdate(
                req.user?._id,
                {
                    $set:{
                        fullname,
                        email
                    }  
                },
                {new: true}
            ).select("-password");

            return res
            .status(200)
            .json(
                new ApiResponse(
                200, userDetails, "user details updated successfully")
            );

        } catch (error) {
            throw new ApiError(400, "data not found");
        }
    }
)

const updateAvatar = asyncHandler(
    async (req, res) => {
        try {
            const userAvatar = req.file?.avatar;

            if(!userAvatar){
                throw new ApiError(401, "file not found");
            }

            const avatar = await uploadFile(userAvatar);

            if(!avatar.url){
                throw new ApiError(400, "error while uploading avatar");
            }

            const avatarFile = await User.findByIdAndUpdate(
                req.user?._id,
                {
                    $set:{
                        avatar: avatar.url,
                    }
                },
                {new: true} 
            ).select("-password");

            return res
            .status(200)
            .json(
                new ApiResponse(200, avatarFile, "avatar image updated")
            );

            // user.avatar = avatar.url;
            // await user.save({validateBeforeSave: false})
        } catch (error) {
            throw new ApiError(400, "user not found");
        }
    }
)

const updateCoverImage = asyncHandler(
    async (req, res) => {
        try {
            const coverImage = req.file?.coverImage;

            if(!coverImage){
                throw new ApiError(401, "file not found");
            }

            const userCoverImage = await uploadFile(coverImage);

            if(!userCoverImage.url){
                throw new ApiError(400, "error while uploading CoverImage");
            }

            const coverFile = await User.findByIdAndUpdate(
                req.user?._id,
                {
                    $set:{
                        coverImage: userCoverImage.url,
                    }
                },
                {new: true} 
            ).select("-password");

            return res
            .status(200)
            .json(
                new ApiResponse(200, coverFile, "cover image updated")
            );

            // user.avatar = avatar.url;
            // await user.save({validateBeforeSave: false})
        } catch (error) {
            throw new ApiError(400, "user not found");
        }
    }
)

const getUserChannelProfile = asyncHandler(
    async (req, res) => {
        const {username} = req.params;

        if(!username?.trim()){
            throw new ApiError(400, 'username not found');
        }

        const channel = await User.aggregate([
            {
                $match:{ // it matches the data in DB, it works like a where clause in sql
                    username: username?.toLowerCase()
                }
            },
            {
                $lookup:{
                    from: "subscriptions", // from which table/document we are join. This data is getting from db,
                                           // so make sure naming convention is based on DB's naming convention.
                    localField:"_id", // by which name we getting the data in current document
                    foreignField:"channel", // name of field from other document
                    as: "subscribers" // by using this name we get the data in current document 
                }
            },
            {
                $lookup:{
                    from: "subscriptions",
                    localField:"_id",
                    foreignField:"subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields:{ // this field adds new fields in thed document
                    subscribersCount:{ 
                        $size: "$subscribers" // size is used to count the totals in "subscribers" field.
                                              // as this is the field, we have to use "$" sign  
                    },
                    subscribedToCount:{
                        $size: "$subscribedTo" // this is the same as subscribers field
                    },
                    isSubscribed:{
                        $condition:{
                            if: {$in: [req.user?._id, "subscribers.subscriber"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project:{ // this is used to project the data on frontend.
                           // we specify the fields which we want to display on frontend
                    fullname: 1,
                    username: 1,
                    subscribersCount: 1,
                    subscribedToCount: 1,
                    isSubscribed:1,
                    avatar: 1,
                    coverImage:1
                }
            }
        ]);

        console.log("channel: ", channel);

        if(!channel?.length){
            throw new ApiError(400, "channel does not exist");
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "user channel fetched")
        );
    }
)

export {
    login, 
    logout,
    updateAvatar,
    registerUser, 
    getcurrentUser,
    updatePassword,
    updateCoverImage,
    refreshAccessToken,
    updateAccountDetails,
    getUserChannelProfile,
};  