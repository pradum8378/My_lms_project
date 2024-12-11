import jwt from "jsonwebtoken";

import handleError from "../error_logs/handleError.js";

function ProtectRoute(req, res, next) {
    const token = req.cookies.accessToken; 
    if (!token)
        return handleError(res, 400, "data key not found")
    jwt.verify(token, "secret", (err, decode) => {
        if (err) {
            return handleError(res, 400, "Invalid token or expired");
        }
        req.userid = decode.userid; 
        next(); 
    });
}


export default ProtectRoute;