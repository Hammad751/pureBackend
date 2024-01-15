import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
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

export {registerUser};