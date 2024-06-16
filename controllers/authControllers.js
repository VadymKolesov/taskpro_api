import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import queryString from "query-string";

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

export const googleAuth = controllerDecorator(async (req, res) =>{
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_url: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].json(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`)
});

export const googleRedirect = controllerDecorator(async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_url: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/auth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });
  
  return res.redirect(`${process.env.FRONTEND_URL}?email=${userData.data.email}`);
});
