const ExternalIp = require("../models/ExternalIp");
const sequelize = require("sequelize");
class ExternalIpController {
  async store(req, res) {
    const [, , , remoteIp] = req.connection.remoteAddress.split(":", -15);
    const headerIp = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0]
      : "";
    const externalIp = headerIp || remoteIp;

    const maxId = await ExternalIp.max("id");

    if (!maxId) {
      const ip = await ExternalIp.create({
        external_ip: externalIp,
      });
      return res.json({ externalIp: ip });
    }

    const { external_ip } = await ExternalIp.findByPk(maxId);

    if (externalIp !== external_ip) {
      try {
        const ip = await ExternalIp.create({
          external_ip: externalIp,
        });
        return res.json({ externalIp: ip });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.json({ message: "Ip já atualizado." });
  }
  async index(req, res) {
    const maxId = await ExternalIp.max("id");

    if (!maxId) {
      return res.status(400).json({ error: "Nenhum ip encontrado!" });
    }

    const { id, external_ip } = await ExternalIp.findByPk(maxId);

    return res.json({ id: id, externalIp: external_ip });
  }
}

module.exports = new ExternalIpController();
