const fetch = require("node-fetch");
class DDNSController {
  async index(req, res) {
    const TOKEN_DUCKDNS = process.env.TOKEN_DUCKDNS;
    const DUCKDNS_DOMAIN_NAME = process.env.DUCKDNS_DOMAIN_NAME;
    const response = await fetch(
      `http://www.duckdns.org/update?domains=${DUCKDNS_DOMAIN_NAME}&token=${TOKEN_DUCKDNS}&ip=&verbose=true`,
      { method: "GET" }
    );

    if (response === "KO") {
      return res.status(404).json({ error: "Ip não foi atualizado" });
    }
    console.log("DDNS Executado!");
    return res.status(200).json({ response: response });
  }
}

module.exports = new DDNSController();
