
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3333
require('dotenv').config();

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnxxphb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        const collection = client.db("craftDB").collection("crafts");
        const categoryCollection = client.db("craftDB").collection("categories");

        app.get('/items', async (req, res) => {
            const cursor = collection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await collection.findOne(query);
            res.send(result);
        })
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result);
        })
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const item = req.body;
            const updatedItem = {
                $set: {
                    item_name: item.item_name,
                    subcategory_Name: item.subcategory_Name,
                    short_description: item.short_description,
                    price: item.price,
                    rating: item.rating,
                    customization: item.customization,
                    processing_time: item.processing_time,
                    stockStatus: item.stockStatus,
                    photo: item.photo,
                },
            };
            const result = await collection.updateOne(query, updatedItem, options);
            res.send(result);
        })
        app.get('/myitems/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { user_email: userEmail };
            const cursor = collection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/items/cata/:subcategory_Name', async (req, res) => {
            const userChoice = req.params.subcategory_Name;
            const query = { subcategory_Name: userChoice };
            const cursor = collection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/items', async (req, res) => {
            const newitem = req.body;
            const result = await collection.insertOne(newitem);
            res.send(result);
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})