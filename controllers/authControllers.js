import controllerDecorator from "../helpers/controllerDecorator.js";
import User from "../models/user.js"; 
import HttpError from "../helpers/HttpError.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

export const registerUser = controllerDecorator(async (req, res, next) => {
    const { email, password, name, avatarUrl } = req.body;
    const emailInToLowerCase = email.toLowerCase();
    const existUser = await User.findOne({ email: emailInToLowerCase });

    if (existUser) {
        throw HttpError(409, "Email is in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        email: emailInToLowerCase,
        password: passwordHash, 
        name
    });

    res.status(201).json({ user: { 
        email: newUser.email,
        theme: newUser.theme, 
        name: newUser.name, 
        avatarUrl: newUser.avatarUrl 
    } });
});

export const loginUser = controllerDecorator(async (req, res, next) => {
    const { email, password, name, avatarUrl } = req.body;
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

    res.status(200).json({ token, user: { 
        email: existUser.email, 
        theme: existUser.theme, 
        name: existUser.name,
        avatarUrl: existUser.avatarUrl
     }});
});

export const logoutUser = controllerDecorator(async (req, res) => {
    const { id: _id } = req.user;
    const user = await User.findById(id);
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(id, {token: null});

    res.sendStatus(204).end();
});

export const getCurrentUser = controllerDecorator(async (req, res, next) => {
    const { email, name, avatarUrl, theme } = req.user;
    res.json({ email, name, avatarUrl, theme });
});

export const updateUserTheme = controllerDecorator(async (req, res, next) => {
    const { id: _id } = req.user;
    const { theme } = req.body;

    const user = await User.findByIdAndUpdate(id , {theme});
    if (!user) {
        throw HttpError(404, "Not found");
    } else if( theme === user.theme){
        throw HttpError(409, "User alredy use this theme")
    }
    res.status(200).json("User's theme changed");
    }
  );

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

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // "dwga7ej8q",
    api_key: process.env.CLOUDINARY_API_KEY, // "677464844986138"
    api_secret: process.env.CLOUDINARY_API_SECRET, // "Yndqj462rQZIjImJBmx4OVxbHSY"
  });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: 'avatars',
      allowed_formats: ['jpg', 'png'],
    },
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











