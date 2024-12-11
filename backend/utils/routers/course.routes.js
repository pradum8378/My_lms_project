import express from "express";
import { coursMulter, createCourse, deleteCourseByFaculty } from "../controllers/course.controller.js";

const courseRoute = express.Router();

courseRoute.post("/create-course/faculty/:fid",coursMulter.single("coursePdf"),createCourse)
courseRoute.delete("/courses/:facultyId",deleteCourseByFaculty)


export default courseRoute;


