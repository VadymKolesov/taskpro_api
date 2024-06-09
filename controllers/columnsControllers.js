import HttpError from "../helpers/HttpError.js";
import Board from "../models/board.js";
import Card from "../models/card.js";
import Column from "../models/column.js";
import controllerDecorator from "../helpers/controllerDecorator.js";

export const createColumn = controllerDecorator(async (req, res) => {
  const board = await Board.findOne({
    owner: req.user._id,
    _id: req.params.id,
  });

  if (!board) {
    throw HttpError(404, "Board not found");
  }

  const column = await Column.create({
    name: req.body.name,
    owner: req.user._id,
    boardId: req.params.id,
  });

  res.status(201).json(column);
});

export const updateColumn = controllerDecorator(async (req, res) => {
  const column = await Column.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  );

  if (!column) {
    throw HttpError(404, "Column not found");
  }

  res.status(200).json(column);
});

export const deleteColumn = controllerDecorator(async (req, res) => {
  const column = await Column.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!column) {
    throw HttpError(404, "Column not found");
  }

  await Card.deleteMany({ columnId: req.params.id, owner: req.user._id });
  await Column.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

  res.status(200).json({ message: "Deleted successfully" });
});
