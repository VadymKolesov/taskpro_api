import Joi from "joi";

// const DATE_REGEXP = /^\d{4}-((0[1-9])|(1[012]))-((0[1-9]|[12]\d)|3[01])$/; // 2024-06-06
const DATE_REGEXP =
  /^(Today, (January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2})$/; // “Today, March 8”

const newBoard = Joi.object({
  title: Joi.string().max(100).required().label("Title").messages({
    "any.required": "Title is required.",
  }),
});

const editBoard = Joi.object({
  title: Joi.string().max(100).required().label("Title").messages({
    "any.required": "Title is required.",
  }),
});

const newCard = Joi.object({
  title: Joi.string().max(100).required().label("Title").messages({
    "any.required": "Title is required.",
  }),
  description: Joi.string().max(250).required().label("Description").messages({
    "any.required": "Description is required.",
  }),
  priority: Joi.string().valid("low", "medium", "high").required(),
  category: Joi.string().valid("to-do", "in-progress", "done").required(),
  dateDeadline: Joi.string().regex(DATE_REGEXP).required().messages({
    "any.required": "Date is required.",
  }),
});

const editCard = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(250),
  priority: Joi.string().valid("low", "medium", "high"),
  category: Joi.string().valid("to-do", "in-progress", "done"),
  dateDeadline: Joi.string().regex(DATE_REGEXP),
});

const newColumn = Joi.object({
  title: Joi.string().max(100).required().label("Title").messages({
    "any.required": "Title is required.",
  }),
}); // приміняти ї для editColumn
