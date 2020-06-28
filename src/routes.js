const { Router } = require("express");
const TelemetryController = require("./app/controllers/TelemetryController");

const routes = new Router();

routes.get("/", (req, res) => res.json({ ok: true }));
routes.get("/externalip", (req, res) => {
  const [, , , externalIp] = req.connection.remoteAddress.split(":", -15);
  res.json({ externalIp });
});
routes.post("/telemetry", TelemetryController.store);
routes.get("/telemetry", TelemetryController.index);
routes.delete("/telemetry/:id", TelemetryController.delete);

module.exports = routes;
