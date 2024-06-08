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
    type: String,
    required: [true, "Deadline is required"],
  },
  columnId: {
    type: Schema.Types.ObjectId,
    ref: "column",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  }
}, { versionKey: false, timestamps: true });

cardSchema.post("save", handleMongooseError);

const Card = model("card", cardSchema);

export default Card;
