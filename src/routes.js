const { Router } = require("express");
const auth = require("./app/middlewares/auth");
const TelemetryController = require("./app/controllers/TelemetryController");
const ExternalIPController = require("./app/controllers/ExternalIPController");
const GraphController = require("./app/controllers/GraphController");
const CpuTempController = require("./app/controllers/CpuTempController");
const DDNSController = require("./app/controllers/DDNSController");
const routes = new Router();

routes.get("/", GraphController.index);

routes.get("/telemetry", TelemetryController.index);

routes.use(auth);

routes.get("/temperature", CpuTempController.sendAlert);

routes.post("/telemetry", TelemetryController.store2);
routes.post("/telemetry/manual", TelemetryController.store);
routes.delete("/telemetry/:id", TelemetryController.delete);

routes.post("/externalip", ExternalIPController.store);
routes.get("/externalip", ExternalIPController.index);
routes.get("/ddns", DDNSController.index);

routes.get("/email", TelemetryController.email);
module.exports = routes;
