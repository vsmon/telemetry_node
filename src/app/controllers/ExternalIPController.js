const nconf = require("nconf");
class ExternalIpController {
  async store(req, res) {
    const ip = nconf.get("ip");
    const [, , , remoteIp] = req.connection.remoteAddress.split(":", -15);
    const headerIp = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0]
      : "";
    const externalIp = headerIp || remoteIp;

    if (ip !== externalIp) {
      nconf.use("memory");
      nconf.load();
      nconf.set("ip", externalIp);
      /* nconf.save((error) => {
              if (error) {
                return res.status(400).json({ error: error.message });
              }
               console.log("Configuration save successfully"); 
            }); */
    }
    return res.json({ externalIp: nconf.get("ip") });
  }
  async index(req, res) {
    const ip = nconf.get("ip");

    if (!ip) {
      return res.status(400).json({ error: "Nenhum ip encontrado!" });
    }

    return res.json({ externalIp: ip });
  }
}

module.exports = new ExternalIpController();
