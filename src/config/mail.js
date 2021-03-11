require("dotenv").config();

module.exports = {
  /* service: process.env.SERVICE,*/
  host: process.env.HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  /*   debug: true,
  logger: true,*/
};
