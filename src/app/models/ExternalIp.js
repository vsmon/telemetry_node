const Sequelize = require("sequelize");

class externalIp extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        external_ip: Sequelize.STRING,
        external_ipv6_network_prefix: Sequelize.STRING,
        internal_ip: Sequelize.STRING,
      },
      { sequelize },
    );
  }
}

module.exports = externalIp;
