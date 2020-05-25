const Sequelize = require("sequelize");
require("dotenv").config();
const Telemetry = require("../app/models/Telemetry");
const connConfig = require("../config/database");
const models = [Telemetry];
class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(process.env.DATABASE_URL || connConfig);

    models.map((model) => model.init(this.connection));
  }
}

module.exports = new Database();
