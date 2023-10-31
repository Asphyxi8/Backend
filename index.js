import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";  //comes with node already
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js"
import { changeProfile } from "./controllers/users.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/posts.js"
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
import User from "./models/User.js"
import Post from "./models/Post.js"
import {users,posts} from "./data/index.js"
//middleware is basically something that run in between different things

console.log(users)
/* Configurations */
dotenv.config()
const __filename = fileURLToPath(import.meta.url); //to grab the file url specifically so u can use directory name
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));    

/* Filestorage */
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"public/assets");
    },
    filename: function (req,file,cb){
        cb(null,file.originalname);
    }
});
/* this is how you save files, any time someone uploads a file to your website^*/
const upload = multer({ storage });
/*anytime you upload file*/
/* ROUTES WITH FILES */


/* this is for post routes */
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts/image",verifyToken,upload.single("picture"),createPost);
app.post("/posts/video",verifyToken,upload.single("video"),createPost);
app.patch("/users/:id/changeProfile", upload.single("picture"),changeProfile);
//path -- > middleware --> actual logic for register (called controller)
//upload.single("picture") we are gonna upload the picture locally into the public/assets folder, and this is the middleware.. if you wanna know where the folder is scroll up to line 30 something?

/* ROUTES */
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)
/* setting up mongoos */
const PORT = process.env.PORT || 6001;
// if process.env.PORT does not work, then it should go to 6001
// console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true, useUnifiedTopology: true, }).then(()=>{
    app.listen(PORT, ()=>console.log(`Server Connected to port ${PORT}`))
    //User.insertMany(users);
    //Post.insertMany(posts);

}).catch((error)=> console.log(`${error} did not connect`))
