import HttpError from "../helpers/HttpError.js";
import Board from "../models/board.js";
import Card from "../models/card.js";
import Column from "../models/column.js";
import controllerDecorator from "../helpers/controllerDecorator.js";

const getAllBoards = controllerDecorator(async (req, res) => {
  const boards = await Board.find({ owner: req.user._id });
  res.status(200).json(boards);
});

const createBoard = controllerDecorator(async (req, res) => {
  const { name, iconName, backgroundName } = req.body;
  const { _id } = req.user;

  const newBoard = await Board.create({
    name,
    iconName,
    backgroundName,
    owner: _id,
  });

  res.status(200).json({
    _id: newBoard._id,
    name: newBoard.name,
    iconName: newBoard.iconName,
    backgroundName: newBoard.backgroundName,
  });
});

const getBoardDetails = controllerDecorator(async (req, res) => {
  const board = await Board.findOne({
    owner: req.user._id,
    _id: req.params.id,
  }).select("_id name iconName backgroundName");

  if (!board) {
    throw HttpError(404, "Board not found");
  }

  const columns = await Column.find({
    owner: req.user._id,
    boardId: board._id,
  }).select("_id name boardId cards");

  const populateCards = async () => {
    const populatedColumns = await Promise.all(
      columns.map(async (column) => {
        const populatedColumn = column.toObject();

        const allCards = await Card.find({ columnId: column._id }).select(
          "_id title description priority isDone deadline columnId"
        );

        const populatedCards = populatedColumn.cards.map((cardId) => {
          const foundCard = allCards.find((card) => card._id.equals(cardId));
          return foundCard;
        });

        populatedColumn.cards = populatedCards;

        return populatedColumn;
      })
    );

    return populatedColumns;
  };

  const populatedColumns = await populateCards();

  res.status(200).json({ board, columns: populatedColumns });
});

const deleteBoard = controllerDecorator(async (req, res) => {
  const { id } = req.params;

  const board = await Board.findOne({ owner: req.user._id, _id: id });
  if (!board) {
    throw HttpError(404, "Board not found");
  }

  const columns = await Column.find({ boardId: id, owner: req.user._id });

  for (const column of columns) {
    await Card.deleteMany({ columnId: column._id, owner: req.user._id });
  }

  await Column.deleteMany({ boardId: id, owner: req.user._id });
  await Board.findOneAndDelete({ owner: req.user._id, _id: id });

  res.status(200).json({ message: "Deleted successfully", _id: board._id });
});

const updateBoard = controllerDecorator(async (req, res) => {
  const board = await Board.findOneAndUpdate(
    { owner: req.user._id, _id: req.params.id },
    req.body,
    { new: true }
  ).select("_id name iconName backgroundName");

  if (!board) {
    throw HttpError(404, "Board not found");
  }

  res.status(200).json(board);
});

export { createBoard, getAllBoards, getBoardDetails, deleteBoard, updateBoard };
