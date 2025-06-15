const express = require("express");
const cors = require("cors");
const routes = require("./routes");
require("./database");
require("./tasks");
const path = require("path");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    //this.server.use(express.static(resolve(__dirname, "public")));
    this.server.use(express.static(path.join(__dirname, "public")));
    this.server.set("views", "src/views");
    this.server.engine("html", require("ejs").renderFile);
    this.server.use(express.json());
    this.server.use(cors());
  }
  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
