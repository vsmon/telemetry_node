const Sequelize = require("sequelize");
class Telemetry extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        temperature: Sequelize.DECIMAL,
        humidity: Sequelize.DECIMAL,
        pressure: Sequelize.DECIMAL,
        altitude: Sequelize.DECIMAL,
        date: Sequelize.DATE,
      },
      { sequelize }
    );
  }
}

module.exports = Telemetry;
