const { Router } = require("express");
const auth = require("./app/middlewares/auth");
const TelemetryController = require("./app/controllers/TelemetryController");
const ExternalIPController = require("./app/controllers/ExternalIPController");
const GraphController = require('./app/controllers/GraphController')
const routes = new Router();

routes.get("/",GraphController.index);

routes.get("/telemetry", TelemetryController.index);

routes.use(auth);

routes.post("/telemetry", TelemetryController.store);
routes.delete("/telemetry/:id", TelemetryController.delete);

routes.post("/externalip", ExternalIPController.store);
routes.get("/externalip", ExternalIPController.index);

module.exports = routes;
