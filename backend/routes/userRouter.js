import express from "express";
import {deleteUser, getUser, getUserProfile, login, logout, signup, updateProfile, updateUser, updateUserAdmin} from "../controller/userController.js";
import { authCheck, checkAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", authCheck, checkAdmin, getUser);
router.get("/profile", authCheck, getUserProfile);
router.put("/updateprofile", authCheck, updateProfile)
router.post("/updateuser/:id", authCheck, checkAdmin, updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.put("/updateuseradmin/:id", authCheck, checkAdmin, updateUserAdmin);

export default router;