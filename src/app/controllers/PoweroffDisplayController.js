const fetch = require("node-fetch");

const { esp8266Data } = require("../../services/api");

class PoweroffDisplayController {
  async store(req, res) {
    const {
      data: { status_display },
    } = await esp8266Data.get("data");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    const currentTime = new Date();

    const initialTime = new Date(
      currentYear,
      currentMonth,
      currentDay,
      0o0,
      30,
      10
    );

    const finalTime = new Date(
      currentYear,
      currentMonth,
      currentDay,
      11,
      30,
      10
    );

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

    if (currentTime > finalTime) {
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
