const axios = require("axios");

const api = axios.create({
  baseURL: "http://apiadvisor.climatempo.com.br/api/v1/",
});

module.exports = api;
