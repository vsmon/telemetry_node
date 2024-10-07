const Telemetry = require("../models/Telemetry");
class HomeController {
  async index(req, res) {
    const size = req.query.size || 72;

    const { count: totalItems } = await Telemetry.findAndCountAll();

    const qtPages = Math.ceil(totalItems / size);

    const page = req.query.page || qtPages;

    const telemetry = await Telemetry.findAll({
      limit: size,
      offset: (page - 1) * size,
      order: [["id", "ASC"]],
    });

    const maxDate = telemetry[telemetry.length - 1].date;
    const minDate = telemetry[0].date;
    console.log("MAX DATE", maxDate);
    console.log("MIN DATE", minDate);

    res.render("index.html", {
      data: JSON.stringify(telemetry),
      totalItems,
      page,
      size,
      qtPages,
    });
  }
}

module.exports = new HomeController();
