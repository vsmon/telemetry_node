const Mail = require("../../services/mail");
class EmailController {
  async send(req, res) {
    const { subject, message } = req.body;
    console.log(req.body);
    try {
      await Mail.sendMail(message, subject);
      return res.status(200).json({ true: "ok" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "Email not sent" });
    }
  }
}

module.exports = new EmailController();
