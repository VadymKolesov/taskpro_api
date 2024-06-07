import Joi from "joi";

const needHelp = Joi.object({
  email: Joi.email().required(),
  comment: Joi.string().max(100).required().messages({
    "string.min": "Comment must contain less than 100 characters",
    "any.required": "Comment is required",
  }),
});

export default { needHelp };
