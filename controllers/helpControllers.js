import nodemailer from "nodemailer";
import HTMLHelpMail from "../helpers/HTMLHelpMail.js";
import HTMLHelpMailCustomer from "../helpers/HTMLHelpMailCustomer.js";
import sendMail from "../helpers/sendEmailOAuth2.js";
import HttpError from "../helpers/HttpError";

const { APLICATION_EMAIL } = process.env;

const message = (userEmail, userComment) => {
  return {
    from: APLICATION_EMAIL,
    to: "help.apptaskpro@gmail.com",
    subject: "Customer need a help!",
    html: HTMLHelpMail(userEmail, userComment),
    text: `Customer email: ${userEmail}. Customer comment: ${userComment}`,
  };
};

const messageForCustomer = (userEmail, userComment) => {
  return {
    from: APLICATION_EMAIL,
    to: userEmail,
    subject: "We have received your message!",
    html: HTMLHelpMailCustomer(userComment),
    text: `We have received your message! Your message: ${userComment}`,
  };
};

export const sendMail = async (req, res) => {
  const userComment = req.body.comment;
  const userEmail = req.body.email;

  try {
    await sendMail(message(userEmail, userComment));
  } catch (error) {
    throw HttpError(500);
  }

  try {
    await sendMail(messageForCustomer(userEmail, userComment));
  } catch (error) {
    throw HttpError(500);
  }

  res.status(200).json({
    message: "Comment sent",
  });
};
