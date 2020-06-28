const { Router } = require("express");
const nconf = require("nconf");
const TelemetryController = require("./app/controllers/TelemetryController");
const ExternalIPController = require("./app/controllers/ExternalIPController");

const routes = new Router();

routes.get("/", (req, res) => res.json({ ok: true }));
routes.post("/externalip", ExternalIPController.store);
routes.get("/externalip", ExternalIPController.index);
routes.post("/telemetry", TelemetryController.store);
routes.get("/telemetry", TelemetryController.index);
routes.delete("/telemetry/:id", TelemetryController.delete);

module.exports = routes;
