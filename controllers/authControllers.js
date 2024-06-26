import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import queryString from "query-string";
import { nanoid } from "nanoid";
import sendMail from "../helpers/sendEmailOAuth2.js";
import HTMLMail from "../helpers/HTMLMail.js";
import HTMLGoogleRegMail from "../helpers/HTMLGoogleRegMail.js";

const { BASE_URL, APLICATION_EMAIL } = process.env;

const message = (userEmail, userName, verificationToken) => {
  return {
    from: APLICATION_EMAIL,
    to: userEmail,
    subject: "Welcome to Taskpro!",
    html: HTMLMail(BASE_URL, userName, verificationToken),
    text: `To verify your email please open the link ${BASE_URL}/api/auth/verify/${verificationToken}`,
  };
};

const googleMessage = (userEmail, userName) => {
  return {
    from: APLICATION_EMAIL,
    to: userEmail,
    subject: "Welcome to Taskpro!",
    html: HTMLGoogleRegMail(userName),
    text: `Thank you for registering with our application. We hope our services will help you organise your work and increase your productivity. If you still have any questions, you can always ask them using a special form in the Taskpro app. So, let's get to the top, shall we?`,
  };
};

export const registerUser = controllerDecorator(async (req, res) => {
  const { email, password, name } = req.body;
  const emailInToLowerCase = email.toLowerCase();
  const existUser = await User.findOne({ email: emailInToLowerCase });

  if (existUser) {
    throw HttpError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  await User.create({
    email: emailInToLowerCase,
    password: passwordHash,
    name,
    verificationToken,
  });

  try {
    await sendMail(message(email, name, verificationToken));
  } catch (error) {
    throw HttpError(500, error);
  }

  res.status(201).json({
    message: "Register successfully",
  });
});

export const verifyEmail = controllerDecorator(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw HttpError(400);
  }

  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  if (user.verify) {
    throw HttpError(409, "Verification has already been passed");
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "48h",
  });

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
    token,
  });

  return res.redirect(
    `${process.env.FRONTEND_URL}/google-redirect?token=${token}`
  );
});

export const resendVerifyEmail = controllerDecorator(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!email) {
    throw HttpError(400, "Bad request");
  }
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(409, "Verification has already been passed");
  }

  try {
    await sendMail(message(email, user.name, user.verificationToken));
  } catch (error) {
    throw HttpError(500, error);
  }

  res.status(200).json({ message: "Verify email sent" });
});

export const loginUser = controllerDecorator(async (req, res) => {
  const { email, password } = req.body;
  const emailInToLowerCase = email.toLowerCase();
  const existUser = await User.findOne({ email: emailInToLowerCase });

  if (!existUser) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!existUser.verify) {
    throw HttpError(400, "Please verify your email");
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

export const googleAuth = controllerDecorator(async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
});

export const googleRedirect = controllerDecorator(async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const userName = userData.data.name;
  const userEmail = userData.data.email;

  const existUser = await User.findOne({ email: userEmail });

  if (existUser) {
    const token = jwt.sign({ id: existUser._id }, process.env.SECRET_KEY, {
      expiresIn: "48h",
    });

    await User.findByIdAndUpdate(existUser._id, { token });

    return res.redirect(
      `${process.env.FRONTEND_URL}/google-redirect?token=${token}`
    );
  }

  const newUser = await User.create({
    email: userEmail,
    password: nanoid(),
    name: userName,
    verify: true,
    verificationToken: null,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: "48h",
  });

  await User.findByIdAndUpdate(newUser._id, { token });

  await sendMail(googleMessage(userEmail, userName));

  return res.redirect(
    `${process.env.FRONTEND_URL}/google-redirect?token=${token}`
  );
});
