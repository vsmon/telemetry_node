class IndicatorsController {
  async index(req, res) {
    res.render("indicators.html", {});
  }
}

module.exports = new IndicatorsController();
