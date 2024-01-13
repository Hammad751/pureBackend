import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
const registerUser = asyncHandler (
    async (req, res) =>{
        console.log(req.body);
        const {username, fullname, email, password} = req.body;
    
        res.status(200).json({message: "user created"})

        if(
            [username, fullname, email, password].
            some((field) => field?.trim() === "")
        ){
            throw new ApiError(400, "All feilds are required.");
        }
        const isExists = User.findOne({
            $or: [{ username }, { email }]
        })

        if(isExists){
            throw new ApiError(409, "user already exists");
        }

        // console.log(req.files);
        const avtLocalPath = req.files?.avatar[0]?.path;
        const coverImgPath = req.files?.coverImage[0]?.path

        if(!avtLocalPath){
            throw new ApiError(400, "image file is required");
        }
        const avatar = await uploadFile(avtLocalPath);
        const coverImage = await uploadFile(coverImgPath);

        if(!avatar) throw new ApiError(400, "avatar is required");

        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverIamge: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
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