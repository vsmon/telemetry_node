"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("telemetries", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      temperature: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      humidity: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      pressure: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      altitude: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("telemetries");
  },
};
