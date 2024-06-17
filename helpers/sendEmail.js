import nodemailer from "nodemailer";
import 'dotenv/config';

const {MAILTRAP_PASSWORD, MAILTRAP_USER} = process.env;

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER, /// 7c05d10d581526
      pass: MAILTRAP_PASSWORD  //// 9760a41f6371c4
    }
})

function sendEmail(message){
   return transport.sendMail(message)
}

export default sendEmail;