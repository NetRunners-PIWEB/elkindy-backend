const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGODB_CLUSTER,
    user: process.env.MONGO_USER,
    pass: encodeURIComponent(process.env.MONGO_PASS),
  },
  logs: "dev",
};
