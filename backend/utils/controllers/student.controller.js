import mongoose from "mongoose"; 
import handleError from "../middleware/error_logs/handleError.js"; 
import bcrypt from 'bcrypt' 
import path from 'path' 
import multer from "multer"; 
import adminModul from "../models/admin.modul.js";
import studentmodul from "../models/student.modul.js";

 
const studentPath = path.join("public/student/") 
const store = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        return cb(null, studentPath) 
    }, 
    filename: (req, file, cb) => { 
        return cb(null, file.originalname) 
    } 
}) 
export const studentMulter = multer({ storage: store }).single('studentProfile') 
 
 
// ! Create new student 
// ! POST API 
export const createStudent = async(req, res) => { 
    const { adminid } = req.params; 
    if (!adminid || !mongoose.Types.ObjectId.isValid(adminid)){ 
        return handleError(res, 400, "Invalid or missing Admin ID"); 
    } 
    const isValidAdminId = await adminModul.findById(adminid) 
    if(!isValidAdminId){ 
        return handleError(res, 404, "Admin not found"); 
    } 
    const { studentName, studentEmail, studentMobile, studentPassword, studentGender, adminId } = req.body; 
    const studentProfile = req.file 
    if (!studentProfile) { 
        return handleError(res, 400, "Student profile is required"); 
    } 
    if (studentName && studentEmail && studentMobile && studentPassword && studentGender && adminId) { 
        try { 
            const checkEmail = await studentmodul.findOne({ studentEmail: studentEmail}) 
            if (checkEmail) { 
                return handleError(res, 400, "Email already exists"); 
            } 
            if(isValidAdminId._id.toString() !== adminId.toString()){ 
                return handleError(res, 403, "Admin id is not matching"); 
            } 
            const salt = await bcrypt.genSalt(12); 
            const hashPass = await bcrypt.hash(studentPassword, salt)  
 
            const studentUser = new studentmodul({ 
                studentName: studentName, 
                studentEmail: studentEmail, 
                studentMobile: studentMobile, 
                studentPassword: hashPass, 
                studentGender: studentGender, 
                adminId: adminId, 
                studentProfile: studentProfile.filename, 
            }) 
            const saveStudent = await studentUser.save(); 
            if(saveStudent) { 
                return handleError(res, 201, "Student created successfully", saveStudent); 
            } else { 
                return handleError(res, 400, "Student creation failed"); 
            } 
        } catch (error) { 
            return handleError(res, 400, "Internal Server Error", error); 
        } 
    }else{ 
        return handleError(res, 400, "All fields are required"); 
    } 
}

// ! Student Login 
export const loginStudent = async(req, res) => { 
    const { studentEmail, studentPassword } = req.body; 
    if(studentEmail && studentPassword){ 
        try { 
            const studentUser = await studentmodul.findOne({ studentEmail: studentEmail}) 
            if(!studentUser){ 
                return handleError(res, 404, "Student not found"); 
            } 
            const isMatch = await bcrypt.compare(studentPassword, studentUser.studentPassword) 
            if(!isMatch){ 
                return handleError(res, 401, "Invalid credentials"); 
            } 
            return res.status(200).json({ 
                success: true, 
                student: studentUser 
            }) 
        } catch (error) { 
            return handleError(res, 500, "Internal Server Error", error); 
        } 
    } 
} 

//! Update student 

export const updateStudent = async (req, res) => {
    const { adminid, studentid } = req.params;

    // Validate IDs
    if (
        !adminid || 
        !mongoose.Types.ObjectId.isValid(adminid) || 
        !studentid || 
        !mongoose.Types.ObjectId.isValid(studentid)
    ) {
        return handleError(res, 400, "Invalid or missing Admin ID or Student ID");
    }

    const { 
        studentName, 
        studentEmail, 
        studentMobile, 
        studentGender,  
        studentPassword, 
        adminId 
    } = req.body;

    const studentProfile = req.file;

    try {
        // Fetch admin and validate
        const admin = await adminModul.findById(adminid);
        if (!admin) {
            return handleError(res, 404, "Admin not found");
        }

        // Fetch student and validate
        const student = await studentmodul.findById(studentid);
        if (!student) {
            return handleError(res, 404, "Student not found");
        }

        // Check email uniqueness
        if (studentEmail) {
            const checkEmail = await studentmodul.findOne({ studentEmail });
            if (checkEmail && checkEmail._id.toString() !== studentid) {
                return handleError(res, 400, "Email already exists");
            }
        }

        // Validate admin relationship
        if (admin._id.toString() !== adminId) {
            return handleError(res, 403, "Admin ID is not matching");
        }

        // Prepare update object
        const updateData = {};
        if (studentName) updateData.studentName = studentName;
        if (studentEmail) updateData.studentEmail = studentEmail;
        if (studentMobile) updateData.studentMobile = studentMobile;
        if (studentGender) updateData.studentGender = studentGender;
        if (studentPassword) {
            const salt = await bcrypt.genSalt(10);
            updateData.studentPassword = await bcrypt.hash(studentPassword, salt);
        }
        if (studentProfile) {
            updateData.studentProfile = studentProfile.filename;
        }

        // Update student
        const updatedStudent = await studentmodul.findByIdAndUpdate(
            studentid,
            updateData,
            { new: true }
        );

        if (!updatedStudent) {
            return handleError(res, 400, "Student update failed");
        }

        // Success response
        return res.status(200).json({
            message: "Student updated successfully",
            data: updatedStudent,
        });

    } catch (error) {
        console.error(error);
        return handleError(res, 500, "Internal server error", error);
    }
};
