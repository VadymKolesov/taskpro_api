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
    updateBoardName,
    updateColumn,
    updateCard,
    updateCardStatus
} from "../controllers/boardsControllers.js";

const boardsRouter = express.Router();

boardsRouter.get("/", authenticate, getAllBoards); // Get all user's boards' names by owner

boardsRouter.get("/:id", authenticate, isValidId, getBoardDetails); // Get board (and its columns with cards) by id and owner

boardsRouter.post("/", authenticate, createBoard); // Create new board

boardsRouter.delete("/:id", authenticate, isValidId, deleteBoard); // Delete board (and its columns with cards) by id and owner

boardsRouter.patch("/:id", authenticate, isValidId, updateBoardName); // Update board name

boardsRouter.post("/:id/columns", authenticate, isValidId, createColumn); // Create new column

boardsRouter.patch("/columns/:id", authenticate, isValidId, updateColumn); // Update column name

boardsRouter.delete("/columns/:id", authenticate, isValidId, deleteColumn); // Delete column (and its cards) by columnId and owner

boardsRouter.post("/columns/:id/cards", authenticate, isValidId, createCard); // Create new card

boardsRouter.patch("/cards/:id", authenticate, isValidId, updateCard); // Update card

boardsRouter.put("/cards/:id", authenticate, isValidId, updateCardStatus); // Update status for card

boardsRouter.delete("/cards/:id", authenticate, isValidId, deleteCard); // Delete card by cardId and owner

export default boardsRouter;
