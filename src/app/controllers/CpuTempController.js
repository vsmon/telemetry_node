const { spawn } = require("child_process");
const Mail = require("../../services/mail");
const notification = require("../../services/notification");
class CpuTempController {
  async sendAlert(req, res) {
    try {
      console.log(
        new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      );
      const temp = spawn("cat", ["/sys/class/thermal/thermal_zone0/temp"]);

      temp.stdout.on("data", async function (data) {
        //console.log("Result1: " + data / 1000 + " degrees Celsius");
        const currentTemp = data / 1000;
        console.log("CPU Temperature : " + currentTemp + " degrees Celsius");

        if (currentTemp >= 75) {
          await Mail.sendMail(
            `A temperatura da cpu do raspberry pi excedeu ${currentTemp}°C, em 85°C, a cpu entrara em throttling.`,
            "Temperatura do CPU do Raspberry pi excedida"
          );

          console.log(
            "Email temperatura excedida enviado",
            `Temp: ${currentTemp}°C`
          );

          const message = {
            title: "Temperatura CPU excedida",
            body: `A temperatura da cpu do raspberry pi excedeu ${currentTemp}°C, em 85°C, a cpu entrara em throttling.`,
          };

          notification(message);
        }
        return res.status(200).json({ temp: currentTemp });
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

module.exports = new CpuTempController();
