import express from "express";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../middlewares/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../schemas/authSchemas.js";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/login", validateBody(loginUserSchema), loginUser); // Login user

authRouter.post("/register", validateBody(registerUserSchema), registerUser); // Register user

authRouter.post("/logout", authenticate, logoutUser); // Logout user

authRouter.get("/current", authenticate, getCurrentUser); // Get current user

export default authRouter;
