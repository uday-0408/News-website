import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  getProfile,
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multerconfig.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", register); // Register
router.post("/login", login); // Login
router.post("/logout", logout); // Logout (token clearing)
router.get("/me", isAuthenticated, getProfile); //get user profile

// PROTECTED ROUTE (Update user profile with image upload)
router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("file"), // 'file' is the field name in the form
  updateProfile
);

export default router;
