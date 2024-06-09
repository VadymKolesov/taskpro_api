import express from "express";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";
import {
  createBoard,
  getAllBoards,
  getBoardDetails,
  deleteBoard,
  updateBoard,
} from "../controllers/boardsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import { boardSchema } from "../schemas/boardsSchemas.js";

const boardsRouter = express.Router();

boardsRouter.get("/", authenticate, getAllBoards); // Get all user's boards by owner

boardsRouter.get("/:id", authenticate, isValidId, getBoardDetails); // Get board (and its columns with cards) by id and owner

boardsRouter.post("/", authenticate, validateBody(boardSchema), createBoard); // Create new board

boardsRouter.delete("/:id", authenticate, isValidId, deleteBoard); // Delete board (and its columns with cards) by id and owner

boardsRouter.patch(
  "/:id",
  authenticate,
  isValidId,
  validateBody(boardSchema),
  updateBoard
); // Update board name

export default boardsRouter;
