import express from "express";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../middlewares/validateBody.js";
import { needHelp } from "../schemas/helpSchemas.js";
import { sendHelpEmails } from "../controllers/helpControllers.js";

const helpRouter = express.Router();

helpRouter.post("/", authenticate, validateBody(needHelp), sendHelpEmails); // Send mail to taskpro.project@gmail.com

export default helpRouter;
