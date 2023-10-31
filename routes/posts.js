import express, { Router } from "express";
import {deletePost, getFeedPosts, getUserPosts, likePost, addComment} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

/*READ*/
router.get("/",verifyToken,getFeedPosts);
router.get("/:userId/posts",verifyToken,getUserPosts);
/*UPDATE*/
router.patch("/:id/like",verifyToken,likePost);
/*DELETE*/
router.delete("/:id",verifyToken,deletePost);
/*COMMENT*/
router.patch("/:id/addComment",verifyToken,addComment);

export default router;