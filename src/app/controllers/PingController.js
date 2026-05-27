class PingController {
  async index(req, res) {
    return res.status(200).json({ Pong: "Pong" });
  }
}

module.exports = new PingController();
