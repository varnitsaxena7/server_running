const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const app = express();
const port = 5646;

const servers = [
  "https://insightengine.onrender.com/",
];

let deployed = false; 

const pingServers = async () => {
  let success = true;

  for (const server of servers) {
    try {
      const res = await axios.get(server);
      console.log(`Successfully pinged: ${server}`);
    } catch (error) {
      console.error(`Error pinging ${server}: ${error.message}`);
      success = false;
      break;
    }
  }

  if (success) {
    deployed = true; 
  } else {
    
    console.log("Deployment failed. Stopping server.");
    process.exit(1); 
  }
};

cron.schedule("*/10 * * * *", () => {
  if (!deployed) {
    pingServers();
  } else {
    console.log("Deployment already successful. Not pinging further.");
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running at port:${port}`);
});
