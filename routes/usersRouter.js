import express from "express";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import validateBody from "../middlewares/validateBody.js";
import {
  updateUserSchema,
  updateThemeSchema,
} from "../schemas/usersSchemas.js";
import {
  updateUser,
  updateUserTheme,
  updateAvatar,
} from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.patch(
  "/",
  authenticate,
  validateBody(updateUserSchema),
  updateUser
); // Update user (name / email / password)

usersRouter.put("/avatar", authenticate, upload.single("avatar"), updateAvatar); // Update user avatar

usersRouter.put(
  "/theme",
  authenticate,
  validateBody(updateThemeSchema),
  updateUserTheme
); // Update user theme

export default usersRouter;
