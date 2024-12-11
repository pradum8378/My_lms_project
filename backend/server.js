import express from 'express';
const app= express();
import 'dotenv/config'
import db from './utils/database/db.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import adminRouter from './utils/routers/admin.routes.js';
import facultyRoute from './utils/routers/faculty.routes.js';
import courseRoute from './utils/routers/course.routes.js';
import StudentRouter from './utils/routers/student.routes.js';
import cookieParser from "cookie-parser";

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors('*'));
app.use(cookieParser());

const port = process.env.port || 4000;



// ! admin routes here
app.use("/api/v1",adminRouter)

// ! faculty routes here
app.use("/api/v1",facultyRoute)

// ! course routes here
app.use("/api/v1",courseRoute)

// ! student routes here
app.use("/api/v1",StudentRouter)




app.listen(port,()=>{
    console.log(`server running on port http://localhost:${port}`)
    db();
})


