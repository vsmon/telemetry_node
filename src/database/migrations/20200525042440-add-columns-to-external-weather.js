"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("telemetries", "city", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("telemetries", "state", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("telemetries", "external_temperature", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
      queryInterface.addColumn("telemetries", "external_humidity", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
      queryInterface.addColumn("telemetries", "external_pressure", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("telemetries", "external_temperature"),
      queryInterface.removeColumn("telemetries", "external_humidity"),
      queryInterface.removeColumn("telemetries", "external_pressure"),
    ]);
  },
};
