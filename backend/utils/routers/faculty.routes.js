import express from "express";
import { createFaculty, facultyMulter, getCourse, loginFaculty, refresh, updateFacultyByAdmin } from "../controllers/faculty.controller.js";
import ProtectRoute from "../middleware/protect_route/Protect.route.js";
// import ProtectRoute from "../middleware/error_logs/protect_route/Protect.route.js";
const facultyRoute=express.Router();




facultyRoute.post("/admin/:adminid/create-faculty",facultyMulter.single("facultyProfile"),createFaculty)
facultyRoute.post("/login-faculty",loginFaculty)
facultyRoute.put("/update-faculty/admin/:adminid/faculty/:fid", updateFacultyByAdmin)
facultyRoute.get("/get-all-course-fid/faculty/:fid",ProtectRoute,getCourse)
facultyRoute.post("/refresh-token",refresh);


export default facultyRoute;






