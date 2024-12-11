import mongoose from "mongoose";
import  "dotenv/config";
const DB= process.env.DB;

const db=async()=>{
    try {
        const connect =await mongoose.connect('mongodb://0.0.0.0/mmm')
        
        if(connect){
            return console.log("connected mongoDB")
        }
    } catch (error) {
        console.log(error)
    }
}
export default db;