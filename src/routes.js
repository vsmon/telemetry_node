const { Router } = require("express");
const TelemetryController = require("./app/controllers/TelemetryController");

const routes = new Router();

routes.get("/", (req, res) => res.json({ ok: true }));
routes.post("/telemetry", TelemetryController.store);
routes.get("/telemetry", TelemetryController.index);
routes.delete("/telemetry/:id", TelemetryController.delete);

module.exports = routes;
