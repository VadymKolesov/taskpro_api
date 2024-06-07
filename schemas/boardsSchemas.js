import Joi from "joi";

const newBoard = Joi.object({
  title: Joi.string()
    .max(30)
    .required()
    .label("Title")
    .message("Title is required."),
  iconName: Joi.string().required(),
  backgroundUrl: Joi.string().required(),
});

const editBoard = Joi.object({
  title: Joi.string().max(30).label("Title"),
  iconName: Joi.string(),
  backgroundUrl: Joi.string(),
}).min(1);

// const newCard = Joi.object({
//   title: Joi.string().max(30).required().label("Title").messages({
//     "any.required": "Title is required.",
//   }),
//   description: Joi.string().max(250).required().label("Description").messages({
//     "any.required": "Description is required.",
//   }),
//   priority: Joi.string().valid("low", "medium", "high").required(),
//   category: Joi.string().valid("to-do", "in-progress", "done").required(),
//   dateDeadline: Joi.string().regex(DATE_REGEXP).required().messages({
//     "any.required": "Date is required.",
//   }),
// });

// const editCard = Joi.object({
//   title: Joi.string().max(100),
//   description: Joi.string().max(250),
//   priority: Joi.string().valid("low", "medium", "high"),
//   category: Joi.string().valid("to-do", "in-progress", "done"),
//   dateDeadline: Joi.string().regex(DATE_REGEXP),
// });

// const newColumn = Joi.object({
//   title: Joi.string().max(100).required().label("Title").messages({
//     "any.required": "Title is required.",
//   }),
// }); // приміняти ї для editColumn

export default { newBoard, editBoard };
