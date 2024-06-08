import User from "../models/user.js";
import controllerDecorator from "../helpers/controllerDecorator.js";
import HttpError from "../helpers/HttpError.js";
import { getAvatar } from "../helpers/getAvatar.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

export const updateUserTheme = controllerDecorator(async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;

  const user = await User.findById(_id);

  if (theme === user.theme) {
    throw HttpError(409, "User alredy use this theme");
  }

  const avatarUrl = user.isUpdatedAvatar ? user.avatarUrl : getAvatar(theme);

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { theme, avatarUrl },
    { new: true }
  );

  res.status(200).json({
    theme: updatedUser.theme,
    avatarUrl: updatedUser.avatarUrl,
  });
});

export const updateUser = controllerDecorator(async (req, res) => {
  const { _id } = req.user;

  if (req.body.password) {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;
  }

  const user = await User.findOneAndUpdate(_id, req.body, {
    new: true,
  });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  res.status(200).json({
    user: {
      email: user.email,
      theme: user.theme,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  });
});

export const updateAvatar = controllerDecorator(async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Image is required");
  }

  const { _id } = req.user;
  const { path, filename } = req.file;

  const avatar = await cloudinary.uploader.upload(path, {
    folder: "taskpro/avatars",
    public_id: filename,
  });

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { avatarUrl: avatar.secure_url, isUpdatedAvatar: true },
    { new: true }
  );

  await fs.unlink(path);

  res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
});
