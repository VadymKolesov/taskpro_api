import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import queryString from "query-string";
import { nanoid } from "nanoid";
import mail from "../helpers/sendEmail.js"
import createVerificatinEmail from "../helpers/verifyEmail.js"

export const registerUser = controllerDecorator(async (req, res) => {
  const { email, password, name } = req.body;
  const emailInToLowerCase = email.toLowerCase();
  const existUser = await User.findOne({ email: emailInToLowerCase });

  if (existUser) {
    throw HttpError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    email: emailInToLowerCase,
    password: passwordHash,
    name,
    verificationToken, 
  });

  const verifyEmail = createVerificatinEmail(emailInToLowerCase, verificationToken);

  await mail.sendMail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      theme: newUser.theme,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
    },
  });
});

export const verifyEmail = controllerDecorator(async (req, res) =>{
  const {verificationToken} = req.params;  
        const user = await User.findOne({verificationToken});

        if(!user) throw HttpError(404, "User not found")   

        await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null}, {new: true}); 

        res.status(200).json({
            message: "Verification successful" });
});

export const resendVerifyEmail = controllerDecorator(async (req, res) =>{
  const {email} = req.body;  
  const user = await User.findOne({email}); 

  if(!email){
    throw HttpError(400, "missing required field email");
  } 
  if(!user){
    throw HttpError(401, "email not foun")  
  } 
  if(user.verify){
    throw HttpError(400, "Verification has already been passed") 
  } 

  const verifyEmail = createVerificatinEmail(emailInToLowerCase, verificationToken);

  await mail.sendMail(verifyEmail);

  res.json({ message: "verify email verify success"  })
});

export const loginUser = controllerDecorator(async (req, res) => {
  const { email, password } = req.body;
  const emailInToLowerCase = email.toLowerCase();
  const existUser = await User.findOne({ email: emailInToLowerCase });

  if (!existUser) {
    throw HttpError(401, "Email or password is wrong");
  }

  if(!existUser.verify) {
    throw HttpError(400, "Please verify your email")
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
  });

  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: "48h",
  });

  await User.findByIdAndUpdate(newUser._id, { token });

  return res.redirect(
    `${process.env.FRONTEND_URL}/google-redirect?token=${token}`
  );
});
