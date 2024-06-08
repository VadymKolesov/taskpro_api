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
const sendMail = (req, res) => {
  console.log(req.body);
  const userComment = req.body.comment; // Коментар користувача
  const userEmail = req.body.email; // Ємейл користувача

  const options = {
    from: userEmail,
    to: "taskpro.project@gmail.com",
    text: `Коментар користувача: ${userComment}\nЕмейл для відповіді: ${userEmail}`,
  };

  res.status(200).json({
    mail: userEmail,
    comment: userComment,
  });

  return transporter.sendMail(options);
};

export default { sendMail };
