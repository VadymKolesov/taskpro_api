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
    const { name, iconName, backgroundUrl } = req.body;
    const { _id } = req.user;

    const newBoard = await Board.create({ name, iconName, backgroundUrl, owner: _id });

    res.status(200).json(newBoard);
});

const getBoardDetails = controllerDecorator(async (req, res) => {
    const board = await Board.findOne({ owner: req.user._id, _id: req.params.id });

    if (!board) {
        throw HttpError(404, "Not found");
    }

    const data = await Column.find({ owner: req.user._id, boardId: board._id });

    const promises = data.map(async column => {
        const plainColumn = column.toObject();
        const cards = await Card.find({ columnId: column._id });

        plainColumn.cards = cards;
        return plainColumn;
    });

    const columns = await Promise.all(promises);
    res.status(200).json({ board, columns });
})

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

    res.status(200).json({ message: "Deleted successfully" });
})

const updateBoard = controllerDecorator(async (req, res) => {
    const board = await Board.findOneAndUpdate({ owner: req.user._id, _id: req.params.id }, req.body, { new: true });

    if (!board) {
        throw HttpError(404, "Not found");
    }

    res.status(200).json(board);
});

const createColumn = controllerDecorator(async (req, res) => {
    const board = await Board.findOne({ owner: req.user._id, _id: req.params.id });

    if (!board) {
        throw HttpError(404, "Board not found");
    }

    const column = await Column.create({ name: req.body.name, owner: req.user._id, boardId: req.params.id });

    res.status(200).json(column);
})

const updateColumn = controllerDecorator(async (req, res) => {
    const column = await Column.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });

    if (!column) {
        throw HttpError(404, "Column not found");
    }

    res.status(200).json(column);
})

const deleteColumn = controllerDecorator(async (req, res) => {
    const column = await Column.findOne({ _id: req.params.id, owner: req.user._id });

    if (!column) {
        throw HttpError(404, "Column not found");
    }

    await Card.deleteMany({ columnId: req.params.id, owner: req.user._id });
    await Column.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    res.status(200).json({ message: "Deleted successfully" });
})

const createCard = controllerDecorator(async (req, res) => {
    const column = await Column.findOne({ owner: req.user._id, _id: req.params.id });

    if (!column) {
        throw HttpError(404, "Column not found");
    }

    const card = await Card.create({ ...req.body, owner: req.user._id, columnId: req.params.id });

    res.status(200).json(card);
})

const deleteCard = controllerDecorator(async (req, res) => {
    const card = await Card.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!card) {
        throw HttpError(404, "Not found");
    }

    res.status(200).json({ message: "Deleted successfully" });
})

const updateCard = controllerDecorator(async (req, res) => {
    const card = await Card.findOne({ _id: req.params.id, owner: req.user._id });

    if (!card) {
        throw HttpError(404, "Not found");
    }

    const updatedCard = await Card.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

    res.status(200).json(updatedCard);
})

const updateCardStatus = controllerDecorator(async (req, res) => {
    const card = await Card.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

    if (!card) {
        throw HttpError(404, "Not found");
    }

    res.status(200).json(card);
})

const updateCardColumn = controllerDecorator(async (req, res, next) => {
    const { id } = req.params;
    const { columnId } = req.body;
    const { _id } = req.user;
    
    const column = await Column.findOne({ _id: columnId, owner: _id });
    if (!column) {
        throw HttpError(404, "Column not found");
    }

    const card = await Card.findOneAndUpdate({ _id: id, owner: _id }, {columnId}, { new: true });
    if (!card) {
       throw HttpError(404, "Card not found");
    }

    res.status(200).json(card);
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
    updateBoard,
    updateColumn,
    updateCard,
    updateCardStatus,
    updateCardColumn
}