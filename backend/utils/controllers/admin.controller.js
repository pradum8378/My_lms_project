import bcrypt from 'bcrypt';
import path from 'path';
import adminModel from '../models/admin.modul.js';
import multer from 'multer';
import handleError from '../middleware/error_logs/handleError.js';
import 'dotenv/config';
import facultyModel from '../models/faculty.modul.js';
import courseModel from '../models/course.modul.js';


const adminPath = path.join("public/admin/")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, adminPath)
    },
    filename: (req, file, cb) => {
        return cb(null, file.originalname);
    }
});
export const multerAdmin = multer({ storage })

export const createAdmin = async (req, res) => {
    const { adminName, adminEmail, adminPassword } = req.body;
    const adminProfile = req.file;
    if (!adminProfile) {
        return handleError(res, 400, "admin profile not found");
    }

    if (!adminName || !adminEmail || !adminPassword) {
        return handleError(res, 400, "All fields are required");
    }

    try {
        const checkEmail = await adminModel.findOne({ adminEmail: adminEmail });
        if (checkEmail) {
            return handleError(res, 400, "Email already exists");
        }

        const salt = await bcrypt.genSalt(12);
        const hashPass = await bcrypt.hash(adminPassword, salt);

        const adminUser = new adminModel({
            adminName: adminName,
            adminEmail: adminEmail,
            adminPassword: hashPass,
            adminProfile: adminProfile.filename,
        });

        const saveAdmin = await adminUser.save();

        if (saveAdmin) {

            // const secretKey = process.env.SECRET_KEY; 
            // const token = jwt.sign({ userId: saveAdmin._id }, process.env.SECRET_KEY, { expiresIn: "4d" });



            return handleError(res, 201, "Admin created successfully", saveAdmin);
        } else {
            return handleError(res, 400, "Cannot save admin");
        }
    } catch (error) {
        console.error(error);
        return handleError(res, 500, "Server error", error);
    }

}

// ! findFAcculty by adminid and fid

export const findFacultyById = async (req, res) => {
    const { adminid, fid } = req.params;
    
    if (!adminid)
        return handleError(res, 400, "admin id not found");

    if (!fid)
        return handleError(res, 400, "faculty id not found");
      
    try {
        const isValidadminId = await adminModel.findById(adminid);
        if (!isValidadminId)
            return handleError(res, 400, "invalid admin Id");
    
        const isValidFacultyId = await facultyModel.findById(fid);
        if (!isValidFacultyId)
            return handleError(res, 400, "Faculty not found");
        
        return (res, 200, " valid faculty and admin ids", isValidFacultyId)

    } catch (error) {
        return handleError(res, 500, "Server error", error);
    }
};

// ! get all faculty by admin

export const get_all_faculty = async (req, res) => {
    const { adminid } = req.params;
    
    if (!adminid) {
        return handleError(res, 400, "Admin ID not provided");
    }

    try {
        const isValidadminId = await adminModel.findById(adminid);
        if (!isValidadminId) {
            return handleError(res, 400, "Invalid Admin ID");
        }
        const findAllFaculty = await facultyModel.find();
        return handleError(res, 200, "success", findAllFaculty)
    } catch (e) {
        return handleError(res, 500, "server error")
    }
}

// ! delete faculty by admin id and fid

export const deleteFacultyByIdadminAdnFid = async (req, res) => {
    const { adminid, fid } = req.params
    if (!adminid)
        return handleError(res, 400, "admin id not found")
    if (!fid)
        return handleError(res, 400, "fid is not found")
    try {
        const isValidadminId = await adminModel.findById(adminid);
        if (!isValidadminId)
            return handleError(res, 400, "invalid admin Id");

        const isValidFacultyId = await facultyModel.findById(fid);
        if (!isValidFacultyId)
            return handleError(res, 400, "Faculty not found");

        if (isValidadminId && findFacultyById) {
            const deleteFaculty = await facultyModel.findOneAndDelete(isValidFacultyId)
            if (deleteFaculty) {
                const deleteassociatedCourse = await courseModel.deleteMany({ facultyId: isValidFacultyId })
                if (deleteassociatedCourse)

                    return handleError(res, 200, "success faculty delete and all associated course deleted", deleteassociatedCourse)
            } else {
                return handleError(res, 400, "cannot delete faculty")
            }
        } else {
            return handleError(res, 400, "some error")
        }
    } catch (error) {
        return handleError(res, 500, "server error")
    }
}

// ! delete all faculty by admin Id ? 

export const deleteAllFacultyByAdmin = async (req, res) => {
    const { adminid } = req.params;

    if (!adminid)
        return handleError(res, 40, "admin id not found")
    try {
        const isValidadminId = await adminModel.findById(adminid)

        if (!isValidadminId)
            return handleError(res, 400, "invalid admin id")
        const deletyeAllFaculty = await facultyModel.deleteMany();

        if (deletyeAllFaculty)
            return handleError(res, 200, "success", deletyeAllFaculty)
    } catch (error) {
        return handleError(res, 500, "Server error");
    }
};

// ! delete all coures by admin id
export const deleteAllCourses = async (req, res) => {
    const { adminid } = req.params;
    if (!adminid) {
        return handleError(res, 400, "Admin ID not provided");
    }
    try {
        const isValidAdmin = await adminModel.findById(adminid);
        if (!isValidAdmin) {
            return handleError(res, 400, "Invalid Admin ID");
        }

        const result = await courseModel.deleteMany();
        if (result.deletedCount > 0) {
            return handleError (res,200,"course delete successfully",result.deletedCount)
        } else {
            return handleError(res, 404, "No courses found to delete");
        }
    } catch (error) {
        return handleError(res, 500, "Server error");
    }
};

//  ! get all course by admin id

export const GetAllCourses = async (req, res) => {
    const { adminid } = req.params;
    if (!adminid) {
        return handleError(res, 400, "Admin ID not provided");
    }
    try {
        const isValidAdmin = await adminModel.findById(adminid);
        if (!isValidAdmin) {
            return handleError(res, 400, "Invalid Admin ID");
        }

        const getAllCourses = await courseModel.find();
        if (!getAllCourses.deletedCount > 0) {
            return handleError (res,200,"get all course successfully",getAllCourses)
        } else {
            return handleError(res, 404, "No courses found to delete");
        }
    } catch (error) {
        return handleError(res, 500, "Server error");
    }
};













