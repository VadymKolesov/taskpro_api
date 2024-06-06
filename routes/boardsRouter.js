import express from "express";
import authenticate from "../middlewares/authenticate.js";
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

boardsRouter.get("/:boardId", authenticate, getBoardDetails); // Get board (and its columns with cards) by id and owner

boardsRouter.post("/", authenticate, createBoard); // Create new board

boardsRouter.delete("/:boardId", authenticate, deleteBoard); // Delete board (and its columns with cards) by id and owner

boardsRouter.patch("/:boardId", authenticate, updateBoardName); // Update board name

boardsRouter.post("/:boardId/columns", authenticate, createColumn); // Create new column

boardsRouter.patch("/columns/:columnId", authenticate, updateColumn); // Update column name

boardsRouter.delete("/columns/:columnId", authenticate, deleteColumn); // Delete column (and its cards) by columnId and owner

boardsRouter.post("/columns/:columnId/cards", authenticate, createCard); // Create new card

boardsRouter.patch("/cards/:cardId", authenticate, updateCard); // Update card

boardsRouter.put("/cards/:cardId", authenticate, updateCardStatus); // Update status for card

boardsRouter.delete("/cards/:cardId", authenticate, deleteCard); // Delete card by cardId and owner

export default boardsRouter;
