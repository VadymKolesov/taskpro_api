import express from "express";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../middlewares/validateBody.js";
import { columnSchema, cardsListSchema } from "../schemas/boardsSchemas.js";

import {
  createColumn,
  updateColumn,
  deleteColumn,
  updateCardsList,
} from "../controllers/columnsControllers.js";

const columnsRouter = express.Router();

columnsRouter.post(
  "/:id",
  authenticate,
  isValidId,
  validateBody(columnSchema),
  createColumn
); // Create new column

columnsRouter.patch(
  "/:id",
  authenticate,
  isValidId,
  validateBody(columnSchema),
  updateColumn
); // Update column name

columnsRouter.delete("/:id", authenticate, isValidId, deleteColumn); // Delete column (and its cards) by columnId and owner

columnsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(cardsListSchema),
  updateCardsList
);

export default columnsRouter;
