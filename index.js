const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

// dotenv config
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());


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
    const lists = database.collection("all-list");

    console.log("MongoDb Connected");

    // Get Packages from mongodb
    app.get("/packages", async (req, res) => {
      const cursor = packages.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // specific element or tour package get
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packages.findOne(query);
      res.json(result);
    });

    // Posting my orders in order List
    app.post("/orderlist", async (req, res) => {
      const obj = req.body;
      const result = await lists.insertOne(obj);
      res.json(result);
    });

    // get all the lists
    app.get("/orderlist", async (req, res) => {
      const cursor = lists.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get  my order data
    app.get("/orderlist/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = lists.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // update Data
    app.put("/status/:id", async (req, res) => {
      const id = req.params.id;
      const getData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: getData.status,
        },
      };
      const result = await lists.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // Remove from list
    app.delete("/lists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await lists.deleteOne(query);
      res.json(result);
    });

    // post new package
    app.post("/packages", async (req, res) => {
      const obj = req.body;
      const result = await packages.insertOne(obj);
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
