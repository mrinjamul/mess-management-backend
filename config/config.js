// import Environment variables
const dotenv = require("dotenv");

dotenv.config();

// Create a config object to hold the application settings
const config = {
  server: {
    appMode: process.env.APP_MODE || "dev",
    address: process.env.ADDRESS || "localhost",
    port: process.env.PORT || 3000,
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || "test",
    user: process.env.DB_USER || "injamul",
    pass: process.env.DB_PASS || "test",
    url: process.env.DB_URL || "mongodb://localhost:27017/test",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
};

module.exports = {
  getConfig: function () {
    return config;
  },
};
