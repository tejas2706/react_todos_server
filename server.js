const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const client = new MongoClient(process.env.MONGO_URL || db.url, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect( err =>{

    if(err) return console.log(err)
    app.use(cors());
    const db = client.db("test");
    require('./routes')(app,db);

    app.listen(port, (err) => {
        if(err) console.log("Error occured while starting the server.",err)    
        console.log(`Server running on ${port}.`);
    })

    // client.close();
})

