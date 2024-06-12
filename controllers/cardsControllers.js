import HttpError from "../helpers/HttpError.js";
import Card from "../models/card.js";
import Column from "../models/column.js";
import controllerDecorator from "../helpers/controllerDecorator.js";
import { isValidObjectId } from "mongoose";

export const createCard = controllerDecorator(async (req, res) => {
  const column = await Column.findOne({
    owner: req.user._id,
    _id: req.params.id,
  });

  if (!column) {
    throw HttpError(404, "Column not found");
  }

  const card = await Card.create({
    ...req.body,
    owner: req.user._id,
    columnId: req.params.id,
  }).select("_id title description priority isDone deadline columnId");

  res.status(200).json({
    _id: card._id,
    title: card.title,
    description: card.description,
    priority: card.priority,
    isDone: card.isDone,
    deadline: card.deadline,
    columnId: card.columnId,
  });
});

export const deleteCard = controllerDecorator(async (req, res) => {
  const card = await Card.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!card) {
    throw HttpError(404, "Card not found");
  }

  res.status(200).json({ message: "Deleted successfully" });
});

export const updateCard = controllerDecorator(async (req, res) => {
  const card = await Card.findOne({ _id: req.params.id, owner: req.user._id });

  if (!card) {
    throw HttpError(404, "Card not found");
  }

  const updatedCard = await Card.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  ).select("_id title description priority isDone deadline columnId");

  res.status(200).json(updatedCard);
});

export const updateCardStatus = controllerDecorator(async (req, res) => {
  const card = await Card.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  }).select("_id title description priority isDone deadline columnId");

  if (!card) {
    throw HttpError(404, "Card not found");
  }

  res.status(200).json(card);
});

export const updateCardColumn = controllerDecorator(async (req, res, next) => {
  const { id } = req.params;
  const { columnId } = req.body;
  const { _id } = req.user;

  if (!isValidObjectId(columnId)) {
    throw HttpError(400, `${columnId} is not a valid id`);
  }

  const column = await Column.findOne({ _id: columnId, owner: _id });
  if (!column) {
    throw HttpError(404, "Column not found");
  }

  const card = await Card.findOneAndUpdate(
    { _id: id, owner: _id },
    { columnId },
    { new: true }
  ).select("_id title description priority isDone deadline columnId");

  if (!card) {
    throw HttpError(404, "Card not found");
  }

  res.status(200).json(card);
});
