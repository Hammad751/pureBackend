import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    tweetBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tweetContent: {
        type: String,
        required
    }
},
{timestamps: true});


export const Tweets = mongoose.model("Tweets", tweetSchema);