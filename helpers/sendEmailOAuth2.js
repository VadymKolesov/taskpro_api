import nodemailer from "nodemailer";
import { google } from "googleapis";

const {
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
  MAIL_REDIRECT_URI,
  MAIL_REFRESH_TOKEN,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
  MAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: MAIL_REFRESH_TOKEN });

async function sendEmail(message) {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "apptaskpro@gmail.com",
      clientId: MAIL_CLIENT_ID,
      clientSecret: MAIL_CLIENT_SECRET,
      refreshToken: MAIL_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  return transporter.sendMail(message);
}

export default sendEmail;
