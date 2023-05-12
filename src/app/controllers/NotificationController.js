const fetch = require("node-fetch");
const notification = require("../../services/notification");
class NotificationController {
  async sendTemperature(req, res) {
    const response = await fetch(
      `http://localhost:3000/temperature?token=${process.env.TOKEN}`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    console.log(json);

    const currentTemp = json.temp.toFixed(2);

    const message = {
      title: "Temperatura CPU Raspberry PI",
      body: `A temperatura atual da cpu do raspberry PI é ${currentTemp}°C. Em 85°C a cpu entrará em throttling.`,
    };

    notification(message);

    return res.status(200).json({ temp: currentTemp });
  }
}

module.exports = new NotificationController();
