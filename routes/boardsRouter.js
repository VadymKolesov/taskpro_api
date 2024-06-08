import express from "express";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";
import {
    createBoard,
    createColumn,
    createCard,
    getAllBoards,
    getBoardDetails,
    deleteBoard,
    deleteColumn,
    deleteCard,
    updateBoard,
    updateColumn,
    updateCard,
    updateCardStatus,
    updateCardColumn
} from "../controllers/boardsControllers.js";
import validateBody from '../middlewares/validateBody.js';
import { boardSchema, columnSchema, cardSchema, cardStatusSchema, idSchema } from "../schemas/boardsSchemas.js";

const boardsRouter = express.Router();

boardsRouter.get("/", authenticate, getAllBoards); // Get all user's boards by owner

boardsRouter.get("/:id", authenticate, isValidId, getBoardDetails); // Get board (and its columns with cards) by id and owner

boardsRouter.post("/", authenticate, validateBody(boardSchema), createBoard); // Create new board

boardsRouter.delete("/:id", authenticate, isValidId, deleteBoard); // Delete board (and its columns with cards) by id and owner

boardsRouter.patch("/:id", authenticate, isValidId, validateBody(boardSchema), updateBoard); // Update board name

boardsRouter.post("/:id/columns", authenticate, isValidId,  validateBody(columnSchema), createColumn); // Create new column

boardsRouter.patch("/columns/:id", authenticate, isValidId, validateBody(columnSchema), updateColumn); // Update column name

boardsRouter.delete("/columns/:id", authenticate, isValidId, deleteColumn); // Delete column (and its cards) by columnId and owner

boardsRouter.post("/columns/:id/cards", authenticate, isValidId, validateBody(cardSchema), createCard); // Create new card

boardsRouter.patch("/cards/:id", authenticate, isValidId, validateBody(cardSchema), updateCard); // Update card

boardsRouter.put("/cards/:id", authenticate, isValidId, validateBody(cardStatusSchema), updateCardStatus); // Update status for card

boardsRouter.delete("/cards/:id", authenticate, isValidId, deleteCard); // Delete card by cardId and owner

boardsRouter.put("/cards/:id/column", authenticate, isValidId, validateBody(idSchema), updateCardColumn);

export default boardsRouter;
