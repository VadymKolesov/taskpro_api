import Joi from "joi";

export const boardSchema = Joi.object({
  title: Joi.string().max(18).required().messages({
    "string.min": "Title must contain less than 18 characters",
    "any.required": "Title is required",
  }),
  iconName: Joi.string().required().messages({
    "any.required": "Icon name is required",
  }),
  backgroundUrl: Joi.string().required().messages({
    "any.required": "Backgound url is required",
  }),
});
