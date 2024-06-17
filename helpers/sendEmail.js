import nodemailer from "nodemailer";
import "dotenv/config";

const { MAILTRAP_PASSWORD, MAILTRAP_USER } = process.env;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
});

function send(message) {
  return transport.sendMail(message);
}

export default { send };
