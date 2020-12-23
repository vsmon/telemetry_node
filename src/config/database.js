require("dotenv").config();

/* module.exports = {
  username: process.env.DB_USERNAME_UMBLER,
  password: process.env.DB_PASSWORD_UMBLER,
  database: process.env.DB_DATABASE_UMBLER,
  host: process.env.DB_HOST_UMBLER,
  port: process.env.DB_PORT_UMBLER,
  dialect: "mysql",
   ssl: false,
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false,
    },
  }, 
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}; 
*/

/* module.exports = {
  username: process.env.DB_USERNAME_UMBLER,
  password: process.env.DB_PASSWORD_UMBLER,
  database: process.env.DB_DATABASE_UMBLER,
  host: process.env.DB_HOST_UMBLER,
  port: process.env.DB_PORT_UMBLER,
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
      freezeTableName: true,
    },
  },
};
 */

module.exports = {
  username: process.env.DB_USERNAME_UMBLER,
  password: process.env.DB_PASSWORD_UMBLER,
  database: process.env.DB_DATABASE_UMBLER,
  host: process.env.DB_HOST_UMBLER,
  port: process.env.DB_PORT_UMBLER,
  dialect: "postgres",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
