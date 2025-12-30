const fetch = require("node-fetch");
const notification = require("../../services/notification");
class NotificationController {
  async send(req, res) {
    const { title, message: body } = req.body;
    const message = {
      title,
      body,
    };

    notification(message);

    return res.status(200).json({ success: true });
  }
}

module.exports = new NotificationController();
