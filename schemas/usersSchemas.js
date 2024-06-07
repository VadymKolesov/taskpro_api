import Joi from "joi";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegex).messages({
    "string.pattern.base": "Invalid email format",
  }),
  password: Joi.string().min(8).messages({
    "string.min": "Password must contain at least 8 characters",
  }),
})
  .min(1)
  .message("Body must contain at least 1 field");

export const updateThemeSchema = Joi.object({
  theme: Joi.string().valid("dark", "light", "violet").required().messages({
    "any.required": "Theme is required",
    "any.only": "Theme must be one of [dark, light, violet]",
  }),
});
