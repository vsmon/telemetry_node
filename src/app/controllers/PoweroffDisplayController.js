const fetch = require("node-fetch");

const { esp8266Data } = require("../../services/api");

class PoweroffDisplayController {
  async store(req, res) {
    const {
      data: { status_display },
    } = await esp8266Data.get("data");

    const currentTime = new Date().toLocaleTimeString();

    const initialTime = new Date(
      "2023-01-30T00:30:00.008-03:00"
    ).toLocaleTimeString();

    const finalTime = new Date(
      "2023-01-30T08:30:00.008-03:00"
    ).toLocaleTimeString();

    console.log("Current Time: ", currentTime);
    console.log("Intial Time: ", initialTime);
    console.log("final Time: ", finalTime);

    if (currentTime > initialTime && currentTime < finalTime) {
      if (status_display === 1) {
        console.log("Desliga");
        const powerOff = await esp8266Data.post("/data", {
          poweroff_display: false,
        });
        console.log(powerOff.data);
      }
    }
    if (currentTime === finalTime) {
      if (status_display === 0) {
        console.log("Liga");
        const powerOn = await esp8266Data.post("/data", {
          poweroff_display: true,
        });
        console.log(powerOn.data);
      }
    }

    console.log("PoweroffDisplayController executado!");
    return res.status(200).json({ status_display });
  }
}

module.exports = new PoweroffDisplayController();
