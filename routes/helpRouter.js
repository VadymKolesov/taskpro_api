import express from "express";
import authenticate from "../middlewares/authenticate.js";

const helpRouter = express.Router();

helpRouter.post("/", authenticate); // Send mail to taskpro.project@gmail.com

export default helpRouter;
