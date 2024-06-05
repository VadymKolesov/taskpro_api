import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    iconName: {
      type: String,
      default: "icon-project-1",
    },
    backgroundUrl: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

boardSchema.post("save", handleMongooseError);

const Board = model("board", boardSchema);

export default Board;
