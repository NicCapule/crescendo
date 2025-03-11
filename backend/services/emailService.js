require("dotenv").config();
const mailgun = require("mailgun-js");

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendEmail = async (to, subject, text) => {
  const data = {
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
  };

  try {
    await mg.messages().send(data);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
