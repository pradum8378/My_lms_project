
import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    facultyName: { type: String },
    facultyEmail: {
        type: String,
        required: true,
        unique: true,
    },
    facultyPassword: { type: String },
    facultyProfile: { type: String },
    facultyMobile: { type: String },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
        required: true,
    },
}, { timestamps: true }); 


const facultyModel = mongoose.model("Faculty", facultySchema);

export default facultyModel;
