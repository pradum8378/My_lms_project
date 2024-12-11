import express from 'express'; 
import { createStudent,  loginStudent,  studentMulter, updateStudent } from '../controllers/student.controller.js'; 
 
 
const StudentRouter = express.Router(); 
 
StudentRouter.post('/create-student/admin/:adminid', studentMulter, createStudent); 
StudentRouter.get("/login-student",loginStudent)
StudentRouter.put('/update-student/admin/:adminid/:studentid', studentMulter, updateStudent); 
export default StudentRouter;