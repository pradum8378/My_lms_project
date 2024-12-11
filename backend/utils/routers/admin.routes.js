
import express from "express";
import { createAdmin, deleteAllCourses, deleteAllFacultyByAdmin, deleteFacultyByIdadminAdnFid, findFacultyById, get_all_faculty, GetAllCourses, multerAdmin } from "../controllers/admin.controller.js";

const adminRouter=express.Router();
adminRouter.post("/create-admin",multerAdmin.single("adminProfile"),createAdmin)
adminRouter.get("/get-faculty/admin/:adminid/:fid",findFacultyById)
adminRouter.get("/get-all-faculty/admin/:adminid",get_all_faculty)
adminRouter.delete("/delete-faculty-byid/admin/:adminid/faculty/:fid",deleteFacultyByIdadminAdnFid)
adminRouter.delete("/delete-all-faculty/admin/:adminid",deleteAllFacultyByAdmin)
adminRouter.delete("/delete-all-course/admin/:adminid",deleteAllCourses)
adminRouter.get("/get-all-course-/admin/:adminid",GetAllCourses)

export default adminRouter;