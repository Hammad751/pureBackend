import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,
        required: true,
    },
    coverIamge:{type: String},

    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type: String,
        required: [true, "wrong credentials"],
    },
    refreshToken:{type: String,}

},{timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModifed("password")) return next();

    this.password = bcryptjs.hashSync(this.password, 10);
    next();
});
userSchema.methods.isValid = async function(password){
    const isValidpass = await bcryptjs.compareSync(password, this.password);
    return isValidpass;
}
userSchema.methods.generateAccessToken = async function()
{
    return await jwt.sign(
    {
        id: this._id,
        emial: this.email
    },
    process.env.ACCESS_KEY,
    {expiresIn: process.env.ACCESS_EXPIRY}
    );
}
userSchema.methods.generateRefershToken = async function(){
    return await jwt.sign(
        { id: this._id },
        process.env.REFERESH_TOKEN_SECRET,
        {expiresIn: process.env.REFERESH_TOKEN_EXPIRY}
    );
}


export const User = mongoose.model('User', userSchema);