import mongoose, { Schema } from "mongoose";

const subScriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whome
        ref: "User"
    },
},{timestamps:true});   

export const Subscription = mongoose.model("Subscription", subScriptionSchema);