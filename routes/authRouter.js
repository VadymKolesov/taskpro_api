import express from "express";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../middlewares/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../schemas/authSchemas.js";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  googleAuth,
  googleRedirect,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/login", validateBody(loginUserSchema), loginUser); // Login user

authRouter.post("/register", validateBody(registerUserSchema), registerUser); // Register user

authRouter.post("/logout", authenticate, logoutUser); // Logout user

authRouter.get("/current", authenticate, getCurrentUser); // Get current user

authRouter.get("/google", googleAuth)

authRouter.get("/google-redirect", googleRedirect)

authRouter.get("/verify/:verifycationToken", verifyEmail);

authRouter.post("/verify", validateBody(loginUserSchema), resendVerifyEmail);

export default authRouter;
