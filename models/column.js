import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const columnSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "board",
    },
    cards: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "card",
        },
      ],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

columnSchema.post("save", handleMongooseError);

const Column = model("column", columnSchema);

export default Column;
