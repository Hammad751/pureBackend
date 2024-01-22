import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    },
    videoLiked: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    liekedTweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweets"
    }

}, {timestamps: true});

export const Likes = new mongoose.model("Likes", likeSchema);