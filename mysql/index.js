const Sequelize = require("sequelize");
const { config } = require("../config/config");
const User = require("./models/users");

const { database, username, password } = config.dev;

const sequelize = new Sequelize(database, username, password, config.dev);

const db = {};

db.sequelize = sequelize;

db.User = User;

module.exports = db;
