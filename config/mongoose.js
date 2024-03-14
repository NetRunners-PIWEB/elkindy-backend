const mongoose = require("mongoose");
const logger = require("../config/logger");
const { mongo } = require("../config/vars");
const f = require("util").format;
mongoose.Promise = global.Promise;

const dbName = process.env.NODE_ENV === 'test' ? 'ElKindyDB_Test' : 'ElKindyDB';

const url = f(
  `mongodb+srv://${mongo.user}:${mongo.pass}@${mongo.uri}/?retryWrites=true&w=majority`
    //'mongodb://localhost:27017'
);
const connect = () => {
  mongoose.connect(url, {
   //dbName:'ElKindyDB'
    dbName : dbName,
  });
  return mongoose.connection;
};

mongoose.connection.on("connected", () => {
  logger.info(`connected to database ${dbName}`);
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

module.exports = { connect };
