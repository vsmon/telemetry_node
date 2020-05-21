const Telemetry = require("../models/Telemetry");
class TelemetryController {
  async store(req, res) {
    const { temperature, humidity, pressure, altitude } = req.body;

    const telemetry = await Telemetry.create({
      temperature,
      humidity,
      pressure,
      altitude,
      date: new Date(),
    });

    return res.json(telemetry);
  }
  async index(req, res) {
    const telemetry = await Telemetry.findAll();

    return res.json(telemetry);
  }
}

module.exports = new TelemetryController();
