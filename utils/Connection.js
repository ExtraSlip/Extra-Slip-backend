const envCredential = require("../config");
const { Sequelize } = require("sequelize");
const DATABASE = envCredential.DATABASE;
const USER = envCredential.USER;
const HOST = envCredential.HOST;
const PASSWORD = envCredential.PASSWORD;
const PORT = envCredential.DB_PORT;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  port: PORT,
  dialectOptions: {
    useUTC: false,
  },
  logging: console.log
});

console.log("DATABASE--------->", DATABASE);
console.log("USER--------->", USER);
console.log("PASSWORD--------->", PASSWORD);
console.log("PORT--------->", PORT);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = sequelize;
