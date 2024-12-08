require("dotenv").config();

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  const message = {
    from: "charleynami@gmail.com",
    to: options.receiverEmail,
    subject: options.subject,
    text: options.message,
    html: options.html ? options.html : null,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId.blue);
    return true;
  } catch (err) {
    console.log(err, "Error sending email");
    return false;
  }
};

module.exports = sendEmail
