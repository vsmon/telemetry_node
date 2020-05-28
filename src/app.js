const express = require("express");
const { resolve } = require("path");
const cors = require("cors");
const routes = require("./routes");
require("./database");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.server.use(express.static(resolve(__dirname, "public")));
    this.server.use(express.json());
    this.server.use(cors());
  }
  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
