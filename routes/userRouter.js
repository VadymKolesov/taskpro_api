import express from "express";

const userRouter = express.Router()


userRouter.post("/register", ); // register
userRouter.get("/verify/:verifycationToken", ); // verifyEmail
userRouter.post("/verify", ); // resendVerifyEmail
userRouter.post("/login", ); // login
userRouter.post("/logout", ); // logout



export default userRouter;