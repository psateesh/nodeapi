//var dbConfig = require("../db_config");

var dbConfig = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql"
  };

var Sequelize = require("sequelize");
var sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
  });

var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.roles = require("./role.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);


module.exports = db;