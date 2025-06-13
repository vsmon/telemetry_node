class GasCalculatorController {
  async index(req, res) {
    res.render("gasCalculator.html", {});
  }
}

module.exports = new GasCalculatorController();
