import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const emailRegexp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    theme: {
      type: String,
      enum: ["dark", "light", "violet"],
      default: "dark",
      required: [true, "Theme is required"],
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dvjg8aoza/image/upload/v1717539986/user-dark_w1uksl.png",
      required: [true, "Avatar url is required"],
    },
    isUpdatedAvatar: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

export default User;
