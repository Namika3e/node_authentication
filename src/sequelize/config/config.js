require('dotenv').config();

// console.log(process.env.DB_HOST)
module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
  
    }
  },
  // test: {
  //   username: process.env.DB_USER || "root",
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  //   host: process.env.DB_HOST || '127.0.0.1',
  //   port: process.env.DB_PORT,
  //   dialect: "postgres",
  //   dialectOptions: {
  //     ssl: {
  //       require: false,
  //     }
  
  //   }
  // },
  // production: {
  //   username: process.env.DB_USER || "root",
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  //   host: process.env.DB_HOST || '127.0.0.1',
  //   port: process.env.DB_PORT,
  //   dialect: "postgres",
  //   dialectOptions: {
  //     ssl: {
  //       require: false,
  //     }
  
  //   }
  // }
}
