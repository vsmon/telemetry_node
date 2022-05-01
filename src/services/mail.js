const nodemailer = require("nodemailer");
const configMail = require("../config/mail");

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport(configMail);
  }
  sendMail(message, subject) {
    return this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: subject,
      text: message,
    });
  }
}

module.exports = new Mail();
