import express from "express";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import validateBody from "../middlewares/validateBody.js";
import { updateUserSchema, updateThemeSchema } from "../schemas/authSchemas.js";
import { updateUser, updateUserTheme } from "../controllers/authControllers.js";

const usersRouter = express.Router();

usersRouter.patch(
  "/",
  authenticate,
  validateBody(updateUserSchema),
  updateUser
); // Update user (name / email / password)

usersRouter.patch("/avatar", authenticate, upload.single("avatar")); // Update user avatar

usersRouter.put(
  "/theme",
  authenticate,
  validateBody(updateThemeSchema),
  updateUserTheme
); // Update user theme

export default usersRouter;
