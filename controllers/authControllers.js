import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js"; 
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from "bcrypt";

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

  export const updateUser = controllerDecorator(async ( req, res, next) =>{
    const { id } = req.user;
    const { password } = req.body;
   
    const hashPassword = await bcrypt.hash(password, 10);
      
    const user = await User.findByIdAndUpdate(
        id,
        {...req.body, 
        password: hashPassword},
        { new: true});  

    if (!user) {
    throw HttpError(404, "Not found");
    }
  
    res.status(200).json({name: user.name, email: user.email});
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

export const updateAvatar = controllerDecorator(async (req, res, next) => {
   
      const { _id } = req.user;
  
      const user = await User.findById(_id);
      if (!user) {
        throw HttpError(404, "User not found");
      }
  
      let avatarURL = user.avatarURL;
  
      if (req.file) {
        if (avatarURL !== "") {
          const urlSliced = avatarURL.slice(62, avatarURL.length - 4);
          await cloudinary.uploader.destroy(urlSliced, {
            invalidate: true,
            resource_type: "image",
          });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          public_id: `${_id}_${req.file.originalname}`,
        });
  
        avatarURL = result.secure_url;
      }

      user.avatarURL = avatarURL;
      await user.save();

      res.status(200).json({ avatarURL });
   
  });