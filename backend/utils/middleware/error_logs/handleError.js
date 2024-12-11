

function handleError(res, status, message, data,token) {
    res.status(status).json({ message: message, data:data ,token:token})
};

// function handleError(res, status, message, data = null) {
//     res.status(status).json({
//         success: status < 400, 
//         message: message,
//         data: data,
//     });
// }



export default handleError;
