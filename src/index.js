import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
});

connectDB()

// const app = express();


















/**
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`app is listening on port http://localhost:${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ", error);
        throw error;
    }
})()

*/