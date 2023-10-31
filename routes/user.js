import express from "express"
import {
    getUser, 
    getUserFriends,
    addRemoveFriend,
    updateViews,
} from "../controllers/users.js"
import {verifyToken} from "../middleware/auth.js"
const router = express.Router()

//read route does not do C U D only does R of the CRUD

/* READ */
router.get("/:id",verifyToken, getUser)
router.get("/:id/friends",verifyToken,getUserFriends)

/* UPDATE FUNCTION */
router.patch("/:id/:friendId",verifyToken,addRemoveFriend)
router.patch("/:id/views",verifyToken,updateViews)

export default router