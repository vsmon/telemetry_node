const { Router } = require("express");
const TelemetryController = require("./app/controllers/TelemetryController");

const routes = new Router();

routes.get("/", (req, res) => res.json({ ok: true }));
routes.get("/externalip", (req, res) => {
  const [, , , remoteIp] = req.connection.remoteAddress.split(":", -15);
  const headerIp = req.headers["x-forwarded-for"].split(",")[0];
  //const externalIp = remoteIp || headerIp;
  res.json({ externalIp: headerIp });
});
routes.post("/telemetry", TelemetryController.store);
routes.get("/telemetry", TelemetryController.index);
routes.delete("/telemetry/:id", TelemetryController.delete);

module.exports = routes;
