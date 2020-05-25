const Sequelize = require("sequelize");
class Telemetry extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        temperature: Sequelize.DECIMAL,
        humidity: Sequelize.DECIMAL,
        pressure: Sequelize.DECIMAL,
        altitude: Sequelize.DECIMAL,
        externalTemperature: Sequelize.DECIMAL,
        externalHumidity: Sequelize.DECIMAL,
        externalPressure: Sequelize.DECIMAL,
        date: Sequelize.DATE,
      },
      { sequelize }
    );
  }
}

module.exports = Telemetry;
