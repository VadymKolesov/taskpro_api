import Joi from "joi";

const needHelp = Joi.object({
  email: Joi.email().required(),
  comment: Joi.string().max(100).required(),
});

export default { needHelp };
