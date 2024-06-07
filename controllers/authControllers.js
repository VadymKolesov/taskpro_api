import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = controllerDecorator(async (req, res) => {
  const { email, password, name } = req.body;
  const emailInToLowerCase = email.toLowerCase();
  const existUser = await User.findOne({ email: emailInToLowerCase });

  if (existUser) {
    throw HttpError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email: emailInToLowerCase,
    password: passwordHash,
    name,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      theme: newUser.theme,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
    },
  });
});

export const loginUser = controllerDecorator(async (req, res) => {
  const { email, password } = req.body;
  const emailInToLowerCase = email.toLowerCase();
  const existUser = await User.findOne({ email: emailInToLowerCase });

  if (!existUser) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, existUser.password);
  if (!isMatch) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: existUser._id }, process.env.SECRET_KEY, {
    expiresIn: "48h",
  });

  await User.findByIdAndUpdate(existUser._id, { token });

  res.status(200).json({
    token,
    user: {
      email: existUser.email,
      theme: existUser.theme,
      name: existUser.name,
      avatarUrl: existUser.avatarUrl,
    },
  });
});

export const logoutUser = controllerDecorator(async (req, res) => {
  const { _id: id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(id, { token: null });

  res.status(204).json();
});

export const getCurrentUser = controllerDecorator(async (req, res) => {
  const { email, name, avatarUrl, theme } = req.user;
  res.json({ user: { email, name, avatarUrl, theme } });
});

export const updateUserTheme = controllerDecorator(async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;

  const user = await User.findById(_id);

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (theme === user.theme) {
    throw HttpError(409, "User alredy use this theme");
  }

  const newUser = await User.findByIdAndUpdate(_id, { theme }, { new: true });

  res.status(200).json({
    user: {
      email: newUser.email,
      theme: newUser.theme,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
    },
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
