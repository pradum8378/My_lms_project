// import mongoose, {  Schema } from "mongoose";

import mongoose, { Schema } from "mongoose";
const courseSchema = new Schema({
    courseTitle:String,
    courseContent:String,
    coursePdf:String,
    courseAuthor:String,
    facultyId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Faculty",
                required:true,
}},{timestamps:true})

const courseModel = mongoose.model("course",courseSchema);
export default courseModel

