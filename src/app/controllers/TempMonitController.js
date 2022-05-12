const { spawn } = require("child_process");
const Mail = require("../../services/mail");
const { restore } = require("../models/Telemetry");
class TempMonitController {
  async sendAlert(req, res) {
    try {
      console.log(
        new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      );
      const temp = spawn("cat", ["/sys/class/thermal/thermal_zone0/temp"]);

      temp.stdout.on("data", async function (data) {
        //console.log("Result1: " + data / 1000 + " degrees Celsius");
        const degressCelsius = data / 1000;
        console.log("CPU Temperature : " + degressCelsius + " degrees Celsius");
        if (degressCelsius >= 75) {
          await Mail.sendMail(
            `A temperatura do cpu excedeu os ${degressCelsius} graus celsius`,
            "Temperatura do CPU do Raspberry pi excedida"
          );
          console.log("Email temperatura enviado");
        }
        return res.status(200).json({ temp: degressCelsius });
      });
      temp.stdout.on("error", (error) => {
        console.error(`stderr: ${error}`);
        return res.status(500).json({ error: error });
      });
      temp.on("error", (error) => {
        console.log("Ocorreu um erro ao executar o processo: ", error);
        return res.status(500).json({ error: error });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
}

module.exports = new TempMonitController();
