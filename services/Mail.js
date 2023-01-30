const nodemailer = require("nodemailer");
const dotenv = require(`dotenv`);

/////set environment variables here
dotenv.config({ path: "config.env" });
const { MAIL_EMAIL, MAIL_PASSWORD } = process.env;
console.log(MAIL_EMAIL, ".....", MAIL_PASSWORD);
const MAIL_SETTINGS = {
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

exports.sendMail = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: "Hello ✔",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to the Lunch app.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
   </div>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
