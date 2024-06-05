import express from "express";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";

const boardsRouter = express.Router();

boardsRouter.get("/", authenticate); // Get all user's boards by owner

boardsRouter.post("/", authenticate); // Create new board

boardsRouter.get("/:id", authenticate, isValidId); // Get board by id and owner

boardsRouter.delete("/:id", authenticate, isValidId); // Delete board by id and owner

boardsRouter.get("/:id/columns", authenticate, isValidId); // Get columns by boardId and owner

boardsRouter.post("/:id/columns", authenticate, isValidId); // Create new column

boardsRouter.patch("/:id/:columnId", authenticate, isValidId); // Update column

boardsRouter.delete("/:id/:columnId", authenticate, isValidId); // Delete column by boardId, columnId and owner

boardsRouter.get("/:id/:columnId/cards", authenticate, isValidId); // Get cards by boardId, columnId and owner

boardsRouter.post("/:id/:columnId/cards", authenticate, isValidId); // Create new card

boardsRouter.patch("/:id/:columnId/:cardId", authenticate, isValidId); // Update card

boardsRouter.put("/:id/:columnId/:cardId", authenticate, isValidId); // Update status for card

boardsRouter.delete("/:id/:columnId/:cardId", authenticate, isValidId); // Delete card by boardId, columnId and owner

export default boardsRouter;
