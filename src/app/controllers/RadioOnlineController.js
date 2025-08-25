class IndicatorsController {
  async index(req, res) {
    res.render("radioOnline.html", {});
  }
}

module.exports = new IndicatorsController();
