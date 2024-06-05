import Joi from 'joi';

const registerUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$')).required(),
    password: Joi.string().min(8).required()
});

const loginUserSchema = Joi.object({
    email: Joi.string().pattern(new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$')).required(),
    password: Joi.string().min(8).required()
});

const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().pattern(new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$')),
    password: Joi.string().min(8)
}).min(1);

const updateThemeSchema = Joi.object({
    theme: Joi.string().valid("dark", "light", "violet").required()
});

export default { registerUserSchema, loginUserSchema, updateUserSchema, updateThemeSchema }
