import HttpError from "../helpers/HttpError.js";
import Board from "../models/board.js";
import Card from "../models/card.js";
import Column from "../models/column.js";
import controllerDecorator from "../helpers/controllerDecorator.js";

const getAllBoards = controllerDecorator(async (req, res) => {
    const boards = await Board.find({ owner: req.user._id });

    if (!boards) {
        throw HttpError(404, "Not found");
    }
    res.status(200).send(boards);
})

const createBoard = controllerDecorator(async (req, res) => {
    const { name, iconName, backgroundUrl } = req.body;
    const { _id } = req.user;

    const newBoard = await Board.create({ name, iconName, backgroundUrl, owner: _id });

    res.status(200).send(newBoard);
})

const getBoardDetails = controllerDecorator(async (req, res) => {
    const board = await Board.findOne({ owner: req.user._id, _id: req.params.boardId });

    if (!board) {
        throw HttpError(404, "Not found");
    }

    const columns = await Column.find({ owner: req.user._id, boardId: board._id });

    const promises = columns.map(async column => {
        const plainColumn = column.toObject();
        const cards = await Card.find({ columnId: column._id });

        if (cards.length === 0) {
            return plainColumn;
        }

        plainColumn.cards = cards;
        return plainColumn;
    });

    const modifiedColumns = await Promise.all(promises);
    res.status(200).send({ board, modifiedColumns });
})

const deleteBoard = controllerDecorator(async (req, res) => {
    const { boardId } = req.params;

    const columns = await Column.find({ boardId, owner: req.user._id });
    if (!columns || columns.length === 0) {
        throw HttpError(404, "No columns found for this board");
    }

    for (const column of columns) {
        await Card.deleteMany({ columnId: column._id, owner: req.user._id });
    }
    await Column.deleteMany({ boardId, owner: req.user._id });

    const board = await Board.findOneAndDelete({ owner: req.user._id, _id: boardId });
    if (!board) {
        throw HttpError(404, "Board not found");
    }

    res.status(200).send({ message: "Deleted successfully" });
})

const updateBoardName = controllerDecorator(async (req, res) => {
    const board = await Board.findOneAndUpdate({ owner: req.user._id, _id: req.params.boardId }, { name: req.body.name }, { new: true });

    if (!board) {
        throw HttpError(404, "Not found");
    }

    res.status(200).send(board);
});

const createColumn = controllerDecorator(async (req, res) => {
    const board = await Board.findOne({ owner: req.user._id, _id: req.params.boardId });

    if (!board) {
        throw HttpError(404, "Board doesn't exist");
    }

    const column = await Column.create({ name: req.body.name, owner: req.user._id, boardId: req.params.boardId });

    res.status(200).send(column);
})

const updateColumn = controllerDecorator(async (req, res) => {
    const column = await Column.findOneAndUpdate({ _id: req.params.columnId, owner: req.user._id }, { name: req.body.name }, { new: true });

    if (!column) {
        throw HttpError(404, "Not found");
    }

    res.status(200).send(column);
})

const deleteColumn = controllerDecorator(async (req, res) => {
    await Card.deleteMany({ columnId: req.params.columnId, owner: req.user._id });

    const column = await Column.findOneAndDelete({ _id: req.params.columnId, owner: req.user._id });

    if (!column) {
        throw HttpError(404, "Not found");
    }

    res.status(200).send({ message: "Deleted successfully" });
})

const createCard = controllerDecorator(async (req, res) => {
    const { title, description, priority, isDone, deadline } = req.body;
    const column = await Column.findOne({ owner: req.user._id, _id: req.params.columnId });

    if (!column) {
        throw HttpError(404, "Column doesn't exist");
    }

    const card = await Card.create({ title, description, priority, isDone, deadline, owner: req.user._id, columnId: req.params.columnId });

    res.status(200).send(card);
})

const deleteCard = controllerDecorator(async (req, res) => {
    const card = await Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id });

    if (!card) {
        throw HttpError(404, "Not found");
    }

    res.status(200).send(card);
})

const updateCard = controllerDecorator(async (req, res) => {
    const { title, description, priority, isDone, deadline } = req.body;
    const card = await Card.findOne({ _id: req.params.cardId, owner: req.user._id });

    if (!card) {
        throw HttpError(404, "Not found");
    }

    const updatedCard = await Card.findOneAndUpdate({ columnId: req.params.columnId, _id: req.params.cardId, owner: req.user._id }, { title, description, priority, isDone, deadline }, { new: true });

    res.status(200).send(updatedCard);
})

const updateCardStatus = controllerDecorator(async (req, res) => {
    const card = await Card.findOneAndUpdate({ _id: req.params.cardId, owner: req.user._id }, { isDone: req.body.isDone }, { new: true });

    if (!card) {
        throw HttpError(404, "Not found");
    }

    res.status(200).send(card);
})

export {
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
}