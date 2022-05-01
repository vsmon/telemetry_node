const {
  apiClimaTempo,
  apiOpenWeather,
  esp8266Data,
} = require("../../services/api");
const Telemetry = require("../models/Telemetry");
const Mail = require("../../services/mail");
const admin = require("../../config/firebase");

const notification = require("../../services/notification");

class TelemetryController {
  async email(req, res) {
    try {
      await Mail.sendMail("teste de email", "Teste de envio");
      return res.status(200).json({ true: "ok" });
    } catch (error) {
      console.log(error);
    }
  }
  async store(req, res) {
    const maxId = await Telemetry.max("id");

    if (maxId) {
      const { createdAt } = await Telemetry.findByPk(maxId);

      const currentHour = new Date().getHours();
      const lastHour = new Date(createdAt).getHours();

      console.log(`Data ultimo registro: ${createdAt}`);
      console.log(`Hora Atual: ${currentHour}`);
      console.log(`Hora do ultimo registro: ${lastHour}`);

      if (new Date().getHours() === new Date(createdAt).getHours()) {
        /* Ignora registro*/
        console.log("Registro Já existe com horario atual.");
        return res.json({ message: "Registro Já existe com horario atual." });
      }
    }

    const { temperature, humidity, pressure, altitude } = req.body;

    const city = req.query.city || "sorocaba";
    const state = req.query.state || "SP";

    const tokenClima = process.env.TOKEN_CLIMATEMPO;
    const tokenOpenWeather = process.env.API_KEY_OPENWEATHER;

    const getForecastOpenWeather = async (
      lat = "-23.506085",
      lon = "-47.454214"
    ) => {
      try {
        const weather = await apiOpenWeather.get(`/onecall`, {
          params: {
            lat: lat,
            lon: lon,
            exclude: "",
            units: "metric",
            appid: tokenOpenWeather,
          },
        });

        const {
          current: { temp: temperature },
          current: { humidity },
          current: { pressure },
        } = weather.data;

        const data = {
          temperature,
          humidity,
          pressure,
        };

        return data;
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
      }
    };
    const getForecastClimaTempo = async (city = "Sorocaba", state = "SP") => {
      try {
        const cities = await api.get(`locale/city`, {
          params: {
            name: city,
            state,
            token: tokenClima,
          },
        });

        const [{ id: idCidade }] = cities.data;
        const weather = await api.get(`weather/locale/${idCidade}/current`, {
          params: {
            token: tokenClima,
          },
        });
        return weather;
      } catch (error) {
        console.log({
          error: `Ocorreu um erro ao criar registro`,
          status: error.response.status,
          detail: error.response.data.detail,
        });
        return res.status(400).json({
          error: `Ocorreu um erro ao criar registro`,
          status: error.response.status,
          detail: error.response.data.detail,
        });
      }
    };

    const weather = await getForecastOpenWeather();

    const {
      temperature: external_temperature,
      humidity: external_humidity,
      pressure: external_pressure,
    } = weather;

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
  async store2(req, res) {
    console.log("executou...");
    try {
      const maxId = await Telemetry.max("id");

      if (maxId) {
        const { createdAt } = await Telemetry.findByPk(maxId);

        const currentHour = new Date().getHours();
        const lastHour = new Date(createdAt).getHours();

        console.log(`Data ultimo registro: ${createdAt}`);
        console.log(`Hora Atual: ${currentHour}`);
        console.log(`Hora do ultimo registro: ${lastHour}`);

        if (new Date().getHours() === new Date(createdAt).getHours()) {
          //Ignora registro
          console.log("Registro Já existe com horario atual.");
          return res
            .status(409)
            .json({ error: "Registro Já existe com horario atual" });
        }
      }

      const esp8266Resp = await esp8266Data.get(`data`);

      const { temperature, humidity, pressure, altitude } = esp8266Resp.data;

      const city = "sorocaba";
      const state = "SP";
      const tokenClima = process.env.TOKEN_CLIMATEMPO;
      const tokenOpenWeather = process.env.API_KEY_OPENWEATHER;

      /* Get forecast Open Weather API */
      const getForecastOpenWeather = async (
        lat = "-23.506085",
        lon = "-47.454214"
      ) => {
        try {
          const weather = await apiOpenWeather.get(`/onecall`, {
            params: {
              lat: lat,
              lon: lon,
              exclude: "",
              units: "metric",
              appid: tokenOpenWeather,
            },
          });

          const {
            current: { temp: temperature },
            current: { humidity },
            current: { pressure },
          } = weather.data;

          const data = {
            temperature,
            humidity,
            pressure,
          };
          return data;
        } catch (error) {
          return { error: true };
        }
      };

      /* Get forecast Clima Tempo API */
      const getForecastClimaTempo = async (city = "Sorocaba", state = "SP") => {
        try {
          const cities = await api.get(`locale/city`, {
            params: {
              name: city,
              state,
              token: tokenClima,
            },
          });

          const [{ id: idCidade }] = cities.data;
          const weather = await api.get(`weather/locale/${idCidade}/current`, {
            params: {
              token: tokenClima,
            },
          });
          return weather;
        } catch (error) {
          return console.log({
            error: `Ocorreu um erro ao criar registro`,
            status: error.response.status,
            detail: error.response.data.detail,
          });
        }
      };

      const weather = await getForecastOpenWeather();

      if (weather.error) {
        var {
          temperature: external_temperature,
          humidity: external_humidity,
          pressure: external_pressure,
        } = esp8266Resp.data;
      } else {
        var {
          temperature: external_temperature,
          humidity: external_humidity,
          pressure: external_pressure,
        } = weather;
      }

      /* Save data in DB */
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

      /* Send notification */
      const message = {
        title: "Temperatura Atual",
        body: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\nTemperatura Interna é: ${temperature}\nTemperatura Externa é: ${external_temperature}\nUmidade Interna é: ${humidity}\nUmidade Externa é: ${external_humidity}`,
      };
      notification(message);

      return res.status(200).json({ ok: true });
    } catch (error) {
      try {
        console.log(`Ocorreu um erro: ${error}`);
        /* Send notification */
        const message = {
          title: "Ocorreu um erro",
          body: error.stack,
        };
        notification(message);
        await Mail.sendMail(error.stack, "OCORREU UM ERRO NA INTEGRACAO");
        console.log(`Email enviado com sucesso.`);
      } catch (error) {
        console.error(`Ocorreu um erro no envio do email:`, error);
      }
    }
  }
}

module.exports = new TelemetryController();
