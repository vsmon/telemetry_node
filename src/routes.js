const { Router } = require("express");
const auth = require("./app/middlewares/auth");
const TelemetryController = require("./app/controllers/TelemetryController");
const ExternalIPController = require("./app/controllers/ExternalIPController");
const GraphController = require("./app/controllers/GraphController");
const GasCalculatorController = require("./app/controllers/GasCalculatorController");
const CpuTempController = require("./app/controllers/CpuTempController");
const DDNSController = require("./app/controllers/DDNSController");
const PoweroffDisplayController = require("./app/controllers/PoweroffDisplayController");
const NotificationController = require("./app/controllers/NotificationController");
const IndicatorsController = require("./app/controllers/IndicatorsController");
const RadioOnlineController = require("./app/controllers/RadioOnlineController");
const routes = new Router();

routes.get("/", GraphController.index);
routes.get("/gascalculator", GasCalculatorController.index);
routes.get("/indicators", IndicatorsController.index);
routes.get("/radio", RadioOnlineController.index);

routes.get("/telemetry", TelemetryController.index);

routes.use(auth);

routes.get("/temperature", CpuTempController.sendAlert);

routes.post("/telemetry", TelemetryController.store2);
routes.post("/telemetry/manual", TelemetryController.store);
routes.delete("/telemetry/:id", TelemetryController.delete);

routes.post("/externalip", ExternalIPController.store);
routes.get("/externalip", ExternalIPController.index);
routes.get("/ddns", DDNSController.index);
routes.post("/poweroffdisplay", PoweroffDisplayController.store);

routes.get("/email", TelemetryController.email);
routes.get("/notifications/cputemp", NotificationController.sendTemperature);
module.exports = routes;
