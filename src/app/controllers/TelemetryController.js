const api = require("../../api/axios");
const Telemetry = require("../models/Telemetry");
class TelemetryController {
  async store(req, res) {
    const { temperature, humidity, pressure, altitude } = req.body;

    const city = "sorocaba";
    const uf = "sp";
    const tokenClima = process.env.TOKEN_CLIMATEMPO;

    try {
      const cities = await api.get(
        `locale/city?name=${city}&state=${uf}&token=${tokenClima}`
      );

      const { id: idCidade } = cities.data[0];
      const weather = await api.get(
        `weather/locale/${idCidade}/current?token=${tokenClima}`
      );

      const { name, state, data: externalWeather } = weather.data;
      const {
        temperature: external_temperature,
        humidity: external_humidity,
        pressure: external_pressure,
      } = externalWeather;
      const telemetry = await Telemetry.create({
        city,
        state,
        temperature,
        humidity,
        pressure,
        altitude,
        external_temperature,
        external_humidity,
        external_pressure,
        date: new Date(),
      });

      return res.json(telemetry);
    } catch (error) {
      return res
        .status(400)
        .json({ error: `Ocorreu um erro ao obter dados climatempo: ${error}` });
    }
  }
  async index(req, res) {
    const telemetry = await Telemetry.findAll();

    return res.json(telemetry);
  }
}

module.exports = new TelemetryController();
