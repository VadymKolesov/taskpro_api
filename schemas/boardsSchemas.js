import Joi from "joi";
import objectIdValidator from "../helpers/objectIdValidator.js";

const icons = [
  "icon-project-1",
  "icon-project-2",
  "icon-project-3",
  "icon-project-4",
  "icon-project-5",
  "icon-project-6",
  "icon-project-7",
  "icon-project-8",
];

const bgs = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

export const boardSchema = Joi.object({
  name: Joi.string().max(18).required().messages({
    "string.max": "Name must contain less than 18 characters",
    "any.required": "Name is required",
  }),
  iconName: Joi.string()
    .valid(...icons)
    .required()
    .messages({
      "any.required": "Icon is required",
      "any.only": "Invalid icon",
    }),
  backgroundName: Joi.string()
    .valid(...bgs)
    .required()
    .messages({
      "any.required": "Backgound is required",
      "any.only": "Invalid background",
    }),
});

export const columnSchema = Joi.object({
  name: Joi.string().max(30).required().messages({
    "string.max": "Name must contain less than 30 characters",
    "any.required": "Name is required",
  }),
});

export const cardSchema = Joi.object({
  title: Joi.string().max(50).required().messages({
    "string.max": "Title must contain less than 50 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(300).required().messages({
    "string.max": "Description must contain less than 300 characters",
    "any.required": "Description is required",
  }),
  deadline: Joi.string().required().messages({
    "any.required": "Deadline is required",
  }),
  priority: Joi.string()
    .required()
    .valid("without", "low", "medium", "high")
    .messages({
      "any.required": "Priority is required",
    }),
});

export const cardStatusSchema = Joi.object({
  isDone: Joi.boolean().required().messages({
    "any.required": "Status is required",
  }),
});

export const idSchema = Joi.object({
  columnId: Joi.string().required(),
});
