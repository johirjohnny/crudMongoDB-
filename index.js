const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'Rdsuu_7xvQjX4gH';

//const uri = "mongodb+srv://organicUser:Rdsuu_7xvQjX4gH'@cluster0.cdrp6.mongodb.net/oraganicdb?retryWrites=true&w=majority";
const uri = "mongodb+srv://organicUser:Rdsuu_7xvQjX4gH@cluster0.cdrp6.mongodb.net/organicUser?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    //read data from database request

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    })
    //send/create/post data to database
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('data added successfully');
                res.redirect('/');
            })
    })
    //select product to update request
    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    //update 
    app.patch('/update/:id', (req, res) => {
        console.log(req.body.price)
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    //delete

    app.delete("/delete/:id", (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);

                res.send(result.deletedCount > 0);


            })
    })



    console.log("database connected")

});



app.listen(3000);