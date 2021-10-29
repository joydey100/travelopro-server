const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// dotenv config
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// user and pass
/* 
user = travelopro
pass = sximUVmptKOojTCB
*/

// Connect with mogodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyyvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelopro");
    const packages = database.collection("packages");

    console.log("MongoDb Connected");

    // Get Packages from mongodb
    app.get("/packages", async (req, res) => {
      const cursor = packages.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

// Running Node Server
app.get("/", (req, res) => {
  res.send("Travelopro Server is Running");
});

// App listening in port
app.listen(port, () => {
  console.log("Running on Port", port);
});
