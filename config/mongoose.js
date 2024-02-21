var mongoose = require("mongoose");
const logger = require("../config/logger");
const { mongo } = require("../config/vars");
const f = require("util").format;
mongoose.Promise = global.Promise;
const url = f(
  //`mongodb+srv://${mongo.user}:${mongo.pass}@${mongo.uri}/?retryWrites=true&w=majority`
  'mongodb://localhost:27017'
);
const connect = () => {
  mongoose.connect(url, {
    dbName:'ElKindyDB'
  });
  return mongoose.connection;
};

mongoose.connection.on("connected", () => {
  logger.info(`connected to database `);
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

module.exports = { connect };
