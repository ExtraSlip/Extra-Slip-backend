const nodemailer = require("nodemailer");
const envCredential = require("../config");

const transporter = nodemailer.createTransport({
  service: envCredential.EMAIL_SERVICE,
  host: envCredential.EMAIL_HOST,
  port: envCredential.EMAIL_PORT,
  secure: true,
  auth: {
    user: envCredential.EMAIL_FROM,
    pass: envCredential.EMAIL_PASSWORD,
  },
});

const sendEmail = async (data) => {
  const mailOptions = {
    from: envCredential.EMAIL_FROM,
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

module.exports = {
  sendEmail,
};
