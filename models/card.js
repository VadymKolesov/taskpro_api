import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const cardSchema = new Schema({
  title: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  priority: {
    type: String,
    enum: ["without", "low", "medium", "high"],
    default: "without",
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  deadline: {
    type: Number,
    required: [true, "Deadline is required"],
  },
});

cardSchema.post("save", handleMongooseError);

const Card = model("card", cardSchema);

export default Card;
