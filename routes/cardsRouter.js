import express from "express";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../middlewares/validateBody.js";
import {
  cardSchema,
  cardStatusSchema,
  idSchema,
} from "../schemas/boardsSchemas.js";
import {
  createCard,
  deleteCard,
  updateCard,
  updateCardStatus,
  updateCardColumn,
} from "../controllers/cardsControllers.js";

const cardsRouter = express.Router();

cardsRouter.post(
  "/:id",
  authenticate,
  isValidId,
  validateBody(cardSchema),
  createCard
); // Create new card

cardsRouter.patch(
  "/:id",
  authenticate,
  isValidId,
  validateBody(cardSchema),
  updateCard
); // Update card

cardsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(cardStatusSchema),
  updateCardStatus
); // Update status for card

cardsRouter.delete("/:id", authenticate, isValidId, deleteCard); // Delete card by cardId and owner

cardsRouter.put(
  "/:id/column",
  authenticate,
  isValidId,
  validateBody(idSchema),
  updateCardColumn
); // Update column for card

export default cardsRouter;
