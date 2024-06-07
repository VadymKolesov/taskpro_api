import nodemailer from "nodemailer";

const { senderEmail, userComment } = req.body; // адреса відправника та текст хелпа

const recipientLetter = "taskpro.project@gmail.com";

// данні листа

const mailOptions = {
  from: senderEmail, // електронна адреса відправника
  to: recipientLetter, // Електронний адрес отримувача тобто taskpro.project@gmail.com
  text: userComment, // Текст листа - comment
};

//транспортер для відправки листа
const transporter = nodemailer.createTransport({
  auth: {
    user: senderEmail, // електронна адреса відправника
  },
});

// відпрака листа

const sendEmail = () => {
  return transporter.sendMail(mailOptions);
};

export default { sendEmail };
