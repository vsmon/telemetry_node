const { spawn } = require("child_process");
const Mail = require("../../services/mail");
const { restore } = require("../models/Telemetry");
class TempMonitController {
  async sendAlert(req, res) {
    try {
      console.log(new Date());
      const temp = spawn("cat", ["/sys/class/thermal/thermal_zone0/temp"]);

      temp.stdout.on("data", async function (data) {
        console.log("Result: " + data / 1000 + " degrees Celsius");
        const degressCelsius = temp / 1000;
        console.log("Result: " + degressCelsius + " degrees Celsius");
        if (degressCelsius >= 47) {
          await Mail.sendMail(
            `Temperatura do cpu excedeu os ${degressCelsius} graus celsius`,
            "Temperatura CPU Raspberry pi excedida"
          );
          console.log("Email enviado");
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
