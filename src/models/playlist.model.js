import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new Schema ({
    playlistName:{
        type: String,
        required: true,
    },
    playlistDescription:{
        type: String,
        required: true,
    },
    playlistVideos:[{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],

    playlistOwner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

playlistSchema.plugin(mongooseAggregatePaginate);

export const Playlist = mongoose.model("Playlist", playlistSchema);