import Joi from "joi";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const needHelp = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base": "Invalid email format",
    "any.required": "Email is required",
  }),
  comment: Joi.string().max(100).required().messages({
    "string.min": "Comment must contain less than 100 characters",
    "any.required": "Comment is required",
  }),
});
