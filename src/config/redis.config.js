const { createClient } = require("redis"); //runs on port 6379 by default

let client;

const initializeRedisClient = async () => {
  if (!client) {
    client = createClient();
    client.on("error", (error) =>
      console.log("error creating redis client", error)
    );
  }

  try {
    const connectCLient = await client.connect();
    if (connectCLient) {
      console.log("connected to redis", connectCLient);
    }
  } catch (error) {
    console.log("error occured while initializing redis");
    throw error;
  }
};

const getValue = async (key) => {
  try {
    const value = await client.json.get(`user:${key}`); // user here simply means the data is stored in the root level of our project. /user:key
    return value;
  } catch (error) {
    console.log("error occured while getting value for key: ", key);
    throw error;
  }
};

const setValue = async (key, value) => {
  try {
    const value = await client.json.set(`user:${key}`, "$", value);
    return value;
  } catch (error) {
    console.log("error occured while setting value for key: ", key);
    throw error;
  }
};

module.exports = { initializeRedisClient, getValue, setValue };
