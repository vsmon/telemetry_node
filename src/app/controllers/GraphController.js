const Telemetry = require("../models/Telemetry");
class HomeController{
    async index(req, res) {
        const telemetry = await Telemetry.findAll();

        res.render('index.html',{data:JSON.stringify(telemetry)})
      }
}

module.exports = new HomeController()