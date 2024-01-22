import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    commentedVideo:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    commentBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});

commentSchema.plugin(mongooseAggregatePaginate);
export const Comments = new mongoose.model("Comments", commentSchema);