require("../../config/firebase");
const { getFirestore } = require("firebase-admin/firestore");
const { spawn } = require("child_process");
const ExternalIp = require("../models/ExternalIp");
const sequelize = require("sequelize");
const fetch = require("node-fetch");
const notification = require("../../services/notification");

class ExternalIpController {
  async store(req, res) {
    try {
      const [, , , remoteIp] = req.connection.remoteAddress.split(":", -15);
      const headerIp = req.headers["x-forwarded-for"]
        ? req.headers["x-forwarded-for"].split(",")[0]
        : "";
      const internalIp = headerIp || remoteIp;
      let externalIp = "";

      const extIp = await fetch("http://api.ipify.org/");
      externalIp = await extIp.text();

      /* if (process.platform === "win32") {
        console.log("O IP externo só pode ser recuperado no sistema linux");
        return res.status(400).json({
          error: "O IP externo só pode ser recuperado no sistema linux",
        });
      } */

      if (externalIp === "" && process.platform !== "win32") {
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
          externalIp = data.toString();
        });
      }

      if (!internalIp || !externalIp) {
        return res
          .status(400)
          .json({ error: "Internal or External IP not available" });
      }
      const ip = await ExternalIp.create({
        external_ip: externalIp,
        internal_ip: internalIp,
      });

      const db = getFirestore();
      const internalIpRef = db.collection("ips").doc("internal");

      await internalIpRef.set({
        ip: internalIp,
        createdAt: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      });

      const externalIpRef = db.collection("ips").doc("external");

      await externalIpRef.set({
        ip: externalIp,
        createdAt: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      });

      const lastExternalIP = await externalIpRef.get();

      if (lastExternalIP.data().ip !== externalIp) {
        const message = {
          title: "IP Externo Alterado",
          body: `O IP externo ${externalIp} foi alterado.`,
        };

        notification(message);
      }

      return res.json({ ip });
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
