import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const icons = ["icon-project-1", "icon-project-2", "icon-project-3", "icon-project-4", "icon-project-5", "icon-project-6", "icon-project-7", "icon-project-8"];

const backgroundUrlRegExp = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,6})(:[0-9]{1,5})?(\/[^\s]*)?$/;
  
const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    iconName: {
      type: String,
      enum: icons,
      required: [true, "Icon name is required"],
    },
    backgroundUrl: {
      type: String,
      match: backgroundUrlRegExp,
      required: [true, "backgroundUrl is required"]
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
