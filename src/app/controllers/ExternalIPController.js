require("../../config/firebase");
const { getFirestore } = require("firebase-admin/firestore");
const { spawn } = require("child_process");
const ExternalIp = require("../models/ExternalIp");
const notification = require("../../services/notification");
const updateCloudflareAccess = require("../../services/updateCloudflareAccess");
const externalIpService = require("../../services/externalIpService");

class ExternalIpController {
  async store(req, res) {
    try {
      const [, , , remoteIp] = req.connection.remoteAddress.split(":", -15);
      const headerIp = req.headers["x-forwarded-for"]
        ? req.headers["x-forwarded-for"].split(",")[0]
        : "";
      const internalIp = headerIp || remoteIp;

      const externalIpv4 = await externalIpService.getExternalIpv4();

      const externalIpv6 = await externalIpService.getContainerIpv6();
      const externalIpv6NetworkPrefix =
        externalIpv6.split(":").slice(0, 4).join(":") + "::/64";

      console.log("External IPV6", externalIpv6);
      console.log("External IPV6 Prefix", externalIpv6NetworkPrefix);

      /* if (process.platform === "win32") {
        console.log("O IP externo só pode ser recuperado no sistema linux");
        return res.status(400).json({
          error: "O IP externo só pode ser recuperado no sistema linux",
        });
      } */

      /* if (externalIpv4 === "" && process.platform !== "win32") {
        const execCommand = spawn("dig", [
          "+short",
          "txt",
          "ch",
          "whoami.cloudflare",
          "@1.0.0.1",
        ]);

        execCommand.on("error", (error) => {
          console.log("Ocorreu um erro ao executar o processo: ", error);
          return res.status(500).json({ error: error });
        });

        execCommand.stdout.on("error", (error) => {
          console.error(`stderr: ${error}`);
          return res.status(500).json({ error: error });
        });
        execCommand.stdout.on("data", (data) => {
          externalIpv4 = data.toString();
        });
      }

      if (!internalIp || !externalIpv4) {
        return res
          .status(400)
          .json({ error: "Internal or External IP not available" });
      } */

      const lastExternalIpStored = await ExternalIp.findOne({
        order: [["createdAt", "DESC"]],
      });

      /* Add external IP on database and Update External IP on cloudflare access app policies  */
      if (
        lastExternalIpStored.dataValues.external_ip !== externalIpv4 ||
        lastExternalIpStored.dataValues.external_ipv6_network_prefix !==
          externalIpv6NetworkPrefix
      ) {
        console.log("Passei1====================");
        const ip = await ExternalIp.create({
          external_ip: externalIpv4,
          internal_ip: internalIp,
          external_ipv6_network_prefix: externalIpv6NetworkPrefix,
        });
        console.log("Passei2====================");
        const updateResult = await updateCloudflareAccess(
          externalIpv4,
          externalIpv6NetworkPrefix,
        );
        if (!updateResult.success) {
          console.error(
            "Falha ao atualizar a política do Cloudflare:",
            updateResult,
          );
        }

        const message = {
          title: "IP Externo Alterado",
          body: `O IP externo foi alterado para ${externalIpv4} e ${externalIpv6NetworkPrefix}.`,
        };

        notification(message);
      }
      /*
      const db = getFirestore();

      const internalIpRef = db.collection("ips").doc("internal");

      await internalIpRef.set({
        ip: internalIp,
        createdAt: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      });

       const externalIpRef = db.collection("ips").doc("external");

      const lastExternalIP = await externalIpRef.get();

      if (lastExternalIP.data().ip !== externalIpv4) {
      }

      await externalIpRef.set({
        ip: externalIpv4,
        createdAt: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      });
 */
      return res.json({
        externalIpv4,
        internalIp,
        externalIpv6NetworkPrefix,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  async index(req, res) {
    const maxId = await ExternalIp.max("id");

    if (!maxId) {
      return res.status(400).json({ error: "Nenhum ip encontrado!" });
    }
    const externalIp = await ExternalIp.findAll({
      order: [["createdAt", "desc"]],
    });

    return res.json({
      externalIp,
    });
  }
}

module.exports = new ExternalIpController();
