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
        // get all service details 
        app.get('/all-service', async(req, res)=>{
            const cursor = totalService.find({});
            const allService = await cursor.toArray();
            res.send(allService);
        })
        // get single service details by id 
        app.get("/all-service/:id", async(req, res)=> {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await totalService.findOne(query);
            res.send(result);
        })

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