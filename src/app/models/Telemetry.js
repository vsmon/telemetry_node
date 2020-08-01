const Sequelize = require("sequelize");
class telemetries extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        temperature: Sequelize.DECIMAL,
        humidity: Sequelize.DECIMAL,
        pressure: Sequelize.DECIMAL,
        altitude: Sequelize.DECIMAL,
        external_temperature: Sequelize.DECIMAL,
        external_humidity: Sequelize.DECIMAL,
        external_pressure: Sequelize.DECIMAL,
        date: Sequelize.DATE,
      },
      { sequelize }
    );
  }
}

module.exports = telemetries;
