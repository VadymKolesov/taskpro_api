import express  from "express";
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";
import userAvatarRouter from "./routes/userAvatarRouter";

const app = express();

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});  

app.use("/api/tasks", taskRouter);
app.use("/users", userRouter);
app.use("/avatar", userAvatarRouter);
  
app.use((err, req, res, next) => {
    const { status = 500, message = "Server error"} = err;
    res.status(status).json({message});
})

app.listen(3000, () => {
    console.log("Server is running. Use our API on port: 3000");
  });

