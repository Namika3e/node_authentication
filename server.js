require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const { sequelize } = require("./src/sequelize/models");
require("dotenv").config();
const cors = require('cors')
const colors = require("colors");
const cookieParser = require("cookie-parser");
const ridersAuthRoute = require("./src/routes/ridersAuth.routes");
const vendorsAuthRoute = require("./src/routes/vendorsAuth.routes");
const helmet = require("helmet");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],

  })
);

app.use(cookieParser());



app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const port = process.env.PORT || 4040;

const server = http.createServer(app);


     server.listen(port, async () => {
      console.log(colors.random("Application listening on port 4040"));
      try {
        await sequelize.authenticate();
    // await initializeRedisClient();
      console.log("Database connection established successfully.");
      } catch (error) {
        console.error("Unable to connect to the database:", error.message);
      }

    });



    const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing server...`);

  // Stop accepting new requests
  server.close(async () => {
    console.log('HTTP server closed.');

    try {
      await sequelize.close(); // Gracefully close Sequelize pool
      console.log('Sequelize connection pool closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing Sequelize:', err);
      process.exit(1);
    }
  });
};


process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // e.g., Docker stop

app.use("/auth_service/api/riders", ridersAuthRoute);
app.use("/auth_service/api/vendors", vendorsAuthRoute);


