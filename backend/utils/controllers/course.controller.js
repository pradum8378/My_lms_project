
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import handleError from "../middleware/error_logs/handleError.js";
import facultyModel from "../models/faculty.modul.js";
import courseModel from "../models/course.modul.js";

const courseDir = path.join("public/course/");
const store = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, courseDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
export const coursMulter = multer({ storage: store });

export const createCourse = async (req, res) => {
    const { courseTitle, courseContent, courseAuthor, facultyId } = req.body;
    const coursePdf = req.file;
    const { fid } = req.params;

    if (!fid || fid.length !== 24) {
        return handleError(res, 400, "Invalid or missing Faculty ID (max 24 digit)");
    }


    const isValidFaculty = await facultyModel.findById(fid);
    if (!isValidFaculty) {
        return handleError(res, 400, "Faculty ID does not exist in the database");
    }

    if (!coursePdf) {
        return handleError(res, 400, "Course PDF must be provided");
    }


    if (!courseTitle || !courseContent || !courseAuthor || !facultyId) {
        return handleError(res, 400, "All fields (courseTitle, courseContent, courseAuthor, facultyId) are required");
    }


    if (facultyId.length !== 24) {
        return handleError(res, 400, "Invalid Faculty ID format");
    }

    try {
        const storeCourse = new courseModel({
            courseTitle,
            courseContent,
            courseAuthor,
            coursePdf: coursePdf.path,
            facultyId
        });

        const saveCourse = await storeCourse.save();

        if (saveCourse) {
            return res.status(201).json({
                message: "Course created successfully",
                course: saveCourse
            });
        } else {
            return handleError(res, 400, "Failed to save the course");
        }
    } catch (error) {
        console.error(error);
        return handleError(res, 500, "Server error occurred");
    }
};


// ! course delete by fauclty id

export const deleteCourseByFaculty = async (req, res) => {
    const { facultyId } = req.params;

    // Validate facultyId
    if (!facultyId || !mongoose.Types.ObjectId.isValid(facultyId)) {
        return handleError(res, 400, "Invalid or missing Faculty ID");
    }

    try {
        // Find and delete the course by facultyId
        const deletedCourse = await courseModel.findOneAndDelete({ facultyId });

        if (!deletedCourse) {
            return handleError(res, 404, "Course not found for the given Faculty ID");
        }

        //  Respond with success
        return res.status(200).json({
            message: "Course deleted successfully",
            data: deletedCourse,
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        return handleError(res, 500, "Internal server error", error);
    }
};









