import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
});


// when db connects, it returns the promises. so we catch here 
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`app is listening on port http://localhost:${process.env.PORT}`);
    })
    app.on("error",(error)=>{
        console.error("ERROR: ", error);
        throw error;
    })
})
.catch((err)=>{
    console.log(`DB CONNECTION ERROR: ${err}`);
})

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