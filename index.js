const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//set middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o2upin6.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("workout pro server is running");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const workOutsDB = client.db("workOutsDB");
    const workOutCollection = workOutsDB.collection("workOuts");

    // add database related apis here
    // find all document using get method
    app.get('/workOuts', async (req, res) => {
        const cursor = workOutCollection.find().sort({duration: -1}).limit(6);
        const result = await cursor.toArray();
        res.send(result);
    })

    // find specific document using get method
    app.get("/workOuts/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await workOutCollection.findOne(query);
        res.send(result);
    })

    app.get("/allWorkOuts", async (req, res) => {
        const cursor = workOutCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // find specific document using get method
    app.get("/allWorkOuts/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await workOutCollection.findOne(query);
        res.send(result);
    })


    // add database api
    app.post("/workOuts", async (req, res) => {
      const newWorkOut = req.body;
      console.log("workOut info", newWorkOut);
      const result = await workOutCollection.insertOne(newWorkOut);
      res.send(result);
    });

    
    // updata database api
    app.patch("/workOuts/:id", async (req, res) => {
      const id = req.params.id;
      const updatedWorkOut = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: updatedWorkOut,
      };
      const result = await workOutCollection.updateOne(query, update);
      res.send(result);
    });

    // delete database api
    app.delete("/workOuts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await workOutCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`workout pro server is running on port: ${port}`);
});
