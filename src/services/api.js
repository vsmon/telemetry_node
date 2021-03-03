const axios = require('axios')
require("dotenv").config();

const tokenClimatempo = process.env.API_KEY_CLIMATEMPO;
const tokenOpenWeather = process.env.API_KEY_OPENWEATHER;

const apiClimaTempo = axios.create({
  baseURL: `http://apiadvisor.climatempo.com.br/api/v1`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  params: { token: tokenClimatempo },
});

const apiOpenWeather = axios.create({
  baseURL: `https://api.openweathermap.org/data/2.5/`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },  
});

const esp8266Data = axios.create({
  baseURL: `http://192.168.0.40:3001`
})

module.exports = { apiClimaTempo, apiOpenWeather, esp8266Data };