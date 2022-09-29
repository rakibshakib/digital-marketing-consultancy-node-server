const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

// connecting to database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSER}/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const digitalMarketingConsultancy = client.db("digital_marketing_consultancy");
        const totalService = digitalMarketingConsultancy.collection("all_service");
        const userAppoinmnets = digitalMarketingConsultancy.collection("user_appoinments")
        const userCollection = digitalMarketingConsultancy.collection("userCollection")
        // get all service details 
        app.get('/all-service', async (req, res) => {
            const cursor = totalService.find({});
            const allService = await cursor.toArray();
            res.send(allService);
        })
        // get single service details by id 
        app.get("/all-service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await totalService.findOne(query);
            res.send(result);
        })
        // post user appoinment data from booking page 
        app.post("/appoinment-data", async (req, res) => {
            const data = req.body;
            const result = await userAppoinmnets.insertOne(data);
            res.json(result);
        });
        // get all appoinment data for admin 
        app.get('/all-appoinments', async (req, res) => {
            const cursor = userAppoinmnets.find({});
            const allAppoinments = await cursor.toArray();
            res.send(allAppoinments);
        })
        // get user appoinment for single user by email 
        app.get("/appoinment-data", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = userAppoinmnets.find(query);
            const singleUserAppoinments = await cursor.toArray();
            res.json(singleUserAppoinments);
        });
        // get all appoinment by single date for admin
        app.get("/appoinments-for-admin", async (req, res) => {
            const date = req.query.date;
            console.log(date);
            const query = { date: date };
            const cursor = userAppoinmnets.find(query);
            const allAppoinments = await cursor.toArray();
            res.json(allAppoinments);
        });
        // delete single appoinment by user 
        app.delete("/appoinment/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await userAppoinmnets.deleteOne(query);
            res.json(result);
        }) 

        // add user information 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        app.put("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const filterUser = { email: user.email };
            const options = { upsert: true };
            const updateUser = { $set: user };
            const result = await userCollection.updateOne(filterUser, updateUser, options);
            res.json(result);
          });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello DIgital marketing server")
})
app.listen(port, () => {
    console.log(`Listening digital marketing server at: `, port);
})