const api = require("../../api/axios");
const Telemetry = require("../models/Telemetry");
class TelemetryController {
  async store(req, res) {
    const maxId = await Telemetry.max("id");
    const { createdAt } = await Telemetry.findByPk(maxId);

    const currentHour = new Date().getHours();
    const lastHour = new Date(createdAt).getHours();

    console.log(`Data ultimo registro: ${createdAt}`);
    console.log(`Hora Atual: ${currentHour}`);
    console.log(`Hora do ultimo registro: ${lastHour}`);

    if (new Date().getHours() === new Date(createdAt).getHours()) {
      /* Ignora registro */
      console.log("Registro Já existe com horario atual.");
      return res.json({ message: "Registro Já existe com horario atual." });
    }
    const { temperature, humidity, pressure, altitude } = req.body;

    const city = req.query.city || "sorocaba";
    const uf = req.query.state || "sp";
    const tokenClima = process.env.TOKEN_CLIMATEMPO;

    try {
      const cities = await api.get(
        //`locale/city?name=${city}&state=${uf}&token=${tokenClima}
        `locale/city`,
        {
          params: {
            name: city,
            state: uf,
            token: tokenClima,
          },
        }
      );

      //const { id: idCidade } = cities.data[0];
      const [{ id: idCidade }] = cities.data;
      const weather = await api.get(`weather/locale/${idCidade}/current`, {
        params: {
          token: tokenClima,
        },
      });

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
        .json({ error: `Ocorreu um erro criar registro: ${error}` });
    }
  }
  async index(req, res) {
    const telemetry = await Telemetry.findAll();
    return res.json(telemetry);
  }
  async delete(req, res) {
    const { id } = req.params;
    try {
      const telemetry = await Telemetry.findByPk(id);
      if (!telemetry) {
        return res
          .status(400)
          .json({ error: `Nenhum registro encontrado com o id: ${id}` });
      }
      await telemetry.destroy();
      return res.json(telemetry);
    } catch (error) {
      res
        .status(400)
        .json({ error: `Ocorreu um erro ao excluir o registro: ${error}` });
    }
  }
}

module.exports = new TelemetryController();
