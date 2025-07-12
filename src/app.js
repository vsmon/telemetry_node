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
    this.server.use(
      express.static(path.join(__dirname, "public"))
    ); /* Uncomment it will be rendered index.html in public directory and commented it will be rendered /views/index.html  */
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
