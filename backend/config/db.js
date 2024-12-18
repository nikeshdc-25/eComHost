import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async()=>{
    try{
        let conn = await mongoose.connect(process.env.MONGODB_URI);     //For security purposes
        console.log(`Connected to db at ${conn.connection.host}`);
    }
    catch(err){
        console.log(`Error connected to db `, err.message);
        process.exit(1);
    }
}

export default connectDB;