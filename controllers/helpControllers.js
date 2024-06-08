import nodemailer from "nodemailer";
import "dotenv/config";

const { MAILTRAP_USERNAME, MAILTRAP_PASSWORD } = process.env;
// Конфігурація транспорту для Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USERNAME,
    pass: MAILTRAP_PASSWORD,
  },
});

// Налаштування листа
export const sendMail = (req, res) => {
  const userComment = req.body.comment; // Коментар користувача
  const userEmail = req.body.email; // Ємейл користувача

  const options = {
    from: userEmail,
    to: "taskpro.project@gmail.com",
    text: `User's comment: ${userComment}\nUser's email: ${userEmail}`,
  };

  res.status(200).json({
    message: "Comment sent",
  });

  return transporter.sendMail(options);
};
