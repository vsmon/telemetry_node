const Sequelize = require("sequelize");

class externalIp extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        external_ip: Sequelize.STRING,
      },
      { sequelize }
    );
  }
}

module.exports = externalIp;
