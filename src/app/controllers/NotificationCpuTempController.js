const fetch = require("node-fetch");
const notification = require("../../services/notification");
class NotificationCpuTempController {
  async send(req, res) {
    try {
      const response = await fetch(
        `http://localhost:3000/temperature?token=${process.env.TOKEN}`,
        { method: "GET" }
      );
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
      const currentTemp = json.temp.toFixed(2);
      const message = {
        title: "Temperatura CPU Raspberry PI",
        body: `A temperatura atual da cpu do raspberry PI é ${currentTemp}°C. Em 85°C a cpu entrará em throttling.`,
      };

      notification(message);
      console.log(json);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new NotificationCpuTempController();
