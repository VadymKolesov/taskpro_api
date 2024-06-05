import express from "express";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/login"); // Login user

authRouter.post("/register"); // Register user

authRouter.post("/logout", authenticate); // Logout user

authRouter.get("/current", authenticate); // Get current user

authRouter.patch("/", authenticate); // Update user (name / email / password)

authRouter.patch("/avatar", authenticate, upload.single("avatar")); // Update user avatar

authRouter.put("/theme", authenticate); // Update user theme

export default authRouter;
