import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js"; 
import HttpError from "../helpers/HttpError.js";
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';


export const registerUser = controllerDecorator(async (req, res, next) => {
    const { email, password, name } = req.body;
    const emailInToLowerCase = email.toLowerCase();
    const existUser = await User.findOne({ email: emailInToLowerCase });

    if (existUser) {
        throw HttpError(409, "Email is in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        email: emailInToLowerCase,
        password: passwordHash, 
        name,
    });

    res.status(201).json({ user: { email: newUser.email, theme: newUser.theme, name:newUser.name } });
});

export const loginUser = controllerDecorator(async (req, res, next) => {
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

    res.status(200).json({ token, user: { email: existUser.email, theme: existUser.theme, name: existUser.name }});
});

export const logoutUser = controllerDecorator(async (req, res) => {
    const { _id: id } = req.user;
    const user = await User.findById(id);
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(id, {token: null});

    res.sendStatus(204).end();
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

  export const updateUser = controllerDecorator(async(req, res, next) =>{
    if (!req.body || Object.keys(req.body).length === 0) {
        throw HttpError(400, "Body must have at least one field");
      }
    const { id } = req.params; 
    const { _id: owner } = req.user; 

    const { name, email, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
        const passwordSalt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, passwordSalt);
      }

    const user = await User.findOneAndUpdate({ _id: id, owner }, updateData, { new: true });

    if (!user) {
    throw HttpError(404, "Not found");
    }
  
    res.status(200).json(user);
});











