import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const icons = [
  "icon-project-1",
  "icon-project-2",
  "icon-project-3",
  "icon-project-4",
  "icon-project-5",
  "icon-project-6",
  "icon-project-7",
  "icon-project-8",
];

const bgs = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

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
    backgroundName: {
      type: String,
      enum: bgs,
      required: [true, "backgroundName is required"],
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
