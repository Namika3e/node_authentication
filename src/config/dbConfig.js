
// require('dotenv').config();

// const { Sequelize } = require('sequelize');  // Correct import for Sequelize

// const sequelize = new Sequelize({
//   dialect: 'postgres',  // Use the dialect as a string
//   database: process.env.DB_DATABASE,
//   username: process.env.DB_USER,  // Change 'user' to 'username'
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   dialectOptions: {
//     ssl: false
      
//       // This option is used to avoid SSL certificate validation issues
    
//   },
//   // dialectOptions: {
//   //   ssl: {
//   //     // require: true,
//   //     // rejectUnauthorized: false, // Use this if you have self-signed certificates
//   //   },
//   // },
//   // logging: console.log,
//   define: {
//     timestamps: false,
//   },
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database:', error);
//   });

// module.exports = sequelize;
