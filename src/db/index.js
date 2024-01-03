import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const DB_connection = await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`);
        console.log(`DB connection instance on db_host:: ${DB_connection.connection.host}`);
    } catch (error) {
        console.error("ERROR: ", error);
        process.exit(1);
    }
}

export default connectDB;