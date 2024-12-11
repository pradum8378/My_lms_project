import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    adminName:String,
    adminEmail:{
        type:String,
        unique:true,
        required:true
    },
    adminPassword:String,
    adminProfile:String

});
const adminModel = mongoose.model("adminData",adminSchema)
export default adminModel;