import bcrypt, { compare } from 'bcrypt';
import multer from "multer";
import handleError from '../middleware/error_logs/handleError.js';
import path from 'path';
import jwt from "jsonwebtoken"
import courseModel from '../models/course.modul.js';
import adminModel from '../models/admin.modul.js';
import facultyModel from '../models/faculty.modul.js';


const facultyDir = path.join("public/faculty")
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        return cb(null, facultyDir)
    },
    filename: (req, file, cb) => {
        return cb(null, file.originalname);
    }
})
export const facultyMulter = multer({ storage })

export const createFaculty = async (req, res) => {
    const { adminid } = req.params;

    const { facultyName, facultyEmail, facultyPassword, facultyMobile, adminId } = req.body;
    const facultyProfile = req.file;

    if (!facultyProfile)
        return handleError(res, 400, "faculty not found")
    if (facultyName && facultyEmail && facultyPassword && facultyMobile && adminId) {
        try {
            const verifyAdminId = await adminModel.findById(adminId);
            if (!verifyAdminId) {
                return handleError(res, 400, "Invalid admin ID");
            }
            if (verifyAdminId._id.toString() !== adminId.toString()) {
                return handleError(res, 400, "Admin ID invalid or mismatch");
            }
            const checkMail = await facultyModel.findOne({ facultyEmail });
            if (checkMail) {
                return handleError(res, 400, "Email already exists");
            }
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(facultyPassword, salt);
            const faculty = new facultyModel({
                facultyName,
                facultyEmail,
                facultyPassword: hash,
                facultyMobile,
                adminId,
                facultyProfile: facultyProfile?.filename
            });
            const saveFaculty = await faculty.save();
            if (saveFaculty) {
                return handleError(res, 201, "Created successfully", saveFaculty);
            } else {
                return handleError(res, 400, "Cannot save faculty");
            }
        } catch (error) {
            console.error(error);
            return handleError(res, 500, "Internal server error");
        }
    } else {
        return handleError(res, 404, "all field are required")
    }
}


// ! login api faculty

function generateToken(userid) {
    return jwt.sign({ userid: userid }, "secret", { expiresIn: "10s" })
}
function generatrefreshToken(userid) {
    return jwt.sign({ userid: userid }, "secret", { expiresIn: "5m" })
}
export const refresh = (req, res) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken)
        return handleError(res, 400, "refresh token not found")

    jwt.verify(refreshToken, "secret", (err, decode) => {
        if (err)
            return handleError(res, 400, "refresh key expire or invalid")

        const newToken = decode.userid;
        const newRefreshToken = generateToken(newToken)
        res.cookie("accessToken", newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 1000 })
    })
    return handleError (res,200,"token refreshed")
}
 // hello   

//  console.log("hu") 


export const loginFaculty = async (req, res) => {
    const { facultyEmail, facultyPassword } = req.body;
    if (facultyEmail && facultyPassword)
        try {
            const faculty = await facultyModel.findOne({ facultyEmail });
            if (!faculty) {
                return handleError(res, 400, "Invalid email");
            }
            const isPasswordValid = await bcrypt.compare(facultyPassword, faculty.facultyPassword);
            if (isPasswordValid) {
                return handleError(res, 400, "Invalid password");
            }
            const userid = faculty._id;
            const accessToken = generateToken(userid)
            const refreshToken = generatrefreshToken(userid)
            // res.cookie("acceseToken", token, { httpOnly: true, maxAge: 2 * 60 * 1000 })
            res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 2 * 60 * 1000 })
            res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 2 * 60 * 1000 })
            return handleError(res, 200, "Login successful", faculty, accessToken, refreshToken);
        } catch (error) {
            console.error(error);
            return handleError(res, 500, "Server error", error);
        }
};

// !  update faculty by fid and admin id
export const updateFacultyByAdmin = async (req, res) => {
    const { adminid, fid } = req.params;
    const { facultyName, facultyEmail, facultyMobile, adminId } = req.body;
    if (!adminid) return handleError(res, 400, "Admin ID not found");
    if (!fid) return handleError(res, 400, "Faculty ID not found");

    try {
        const isValidadminId = await adminModel.findById(adminid);
        if (!isValidadminId) {
            return handleError(res, 400, "Invalid admin ID", isValidFacultyId);
        }
        const isValidFacultyId = await facultyModel.findById(fid);

        if (!isValidFacultyId) {
            return handleError(res, 400, "Faculty not found");
        }
        if (isValidadminId._id.toString() !== adminId.toString()) {
            return handleError(res, 400, "Invalid admin ID match");
        }
        const updatedFaculty = await facultyModel.findByIdAndUpdate(fid, { facultyName, facultyEmail, facultyMobile, adminId }, { new: true });
        if (updatedFaculty) {
            return handleError(res, 200, "Faculty updated successfully", updatedFaculty);
        } else {
            return handleError(res, 400, "Unable to update faculty");
        }
    } catch (error) {
        return handleError(res, 500, "Server error");
    }
};



// ! get all course by faculty id

export const getCourse = async (req, res) => {
    const { fid } = req.params;
    // const token = req.headers['authorization']

    if (!fid) {
        return handleError(res, 400, "faculty id not found")
    }
    if (fid.length !== 24)
        return handleError(res, 400, "Invalid length")
    const isValidFacultyId = await facultyModel.findById(fid);
    if (!isValidFacultyId)
        return handleError(res, 400, "invalid facuty id")
    try {
        const findCourse = await courseModel.find({ facultyId: isValidFacultyId }).select('-courseAuthor')
        if (isValidFacultyId) {
            return handleError(res, 200, "success", findCourse)
        } else {
            return handleError(res, 400, "cannot find course")
        }
    } catch (error) {
        return handleError(res, 500, "server error")
    }
}