require("dotenv").config();

module.exports = {
  use_env_variable: process.env.DATABASE_URL || process.env.ENV_DEV,
  config: {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
