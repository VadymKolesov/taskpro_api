import express from "express";

const taskRouter = express.Router();

taskRouter.get("/", );    // getAllTasks

taskRouter.get("/:id", );  // getOneTask

taskRouter.delete("/:id", ); // deleteTask

taskRouter.post("/",  ) ;  // createTask

taskRouter.put("/:id", ); // updateTask 

taskRouter.patch("/:id/favorite", );  // updateFavoriteTask

export default taskRouter;