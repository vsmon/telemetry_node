const Sequelize = require("sequelize");
require("dotenv").config();
const Telemetry = require("../app/models/Telemetry");
const connConfig = require("../config/database");
const ExternalIp = require("../app/models/ExternalIp");
const models = [Telemetry, ExternalIp];

class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(
      /* connConfig.use_env_variable,
      connConfig.config */
      connConfig
    );

    models.map((model) => model.init(this.connection));
  }
}

module.exports = new Database();
