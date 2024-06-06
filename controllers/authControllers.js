import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js"; 
import HttpError from "../helpers/HttpError.js";
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';


export const registerUser = controllerDecorator(async (req, res, next) => {
    const { email, password } = req.body;
    const emailInToLowerCase = email.toLowerCase();
    const existUser = await User.findOne({ email: emailInToLowerCase });

    if (existUser !== null) {
        throw HttpError(409, "Email is in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(emailInToLowerCase, { s: "250", r: "pg", d: "mm" }, true);

    const newUser = await User.create({
        email: emailInToLowerCase,
        password: passwordHash,
        avatarURL,
        verificationToken
    });

    res.status(201).json({ user: { email: newUser.email, theme: newUser.theme } });
});

export const loginUser = controllerDecorator(async (req, res, next) => {
    const { email, password } = req.body;
    const emailInToLowerCase = email.toLowerCase();
    const existUser = await User.findOne({ email: emailInToLowerCase });

    if (!existUser) {
        throw HttpError(401, "Email not found");
    }

    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
        throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });    /// !!!!! jwt secret key

    await User.findOneAndUpdate({ email: emailInToLowerCase }, { token });

    res.status(200).json({ user: { email: existUser.email, theme: existUser.theme }, token });
});

export const logoutUser = controllerDecorator(async (req, res) => {
    const { id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(id, { token: null }, { new: true });

    if (!updatedUser) {
        throw HttpError(404, "User not found");
    }

    res.sendStatus(204);
});

export const getCurrentUser = controllerDecorator(async (req, res, next) => {
    const { email, theme } = req.user;
    res.json({ email, theme });
});

export const updateUserTheme = controllerDecorator(async (req, res, next) => {
    const { id } = req.params;
    const { theme } = req.body;

    console.log(theme);

    const user = await User.findByIdAndUpdate(id , {theme});
    if (!user) {
        throw HttpError(404, "Not found");
    } else if( theme === user.theme){
        throw HttpError(409, "User alredy use this theme")
    }
    res.status(200).json("User change theme");
    }
  );









