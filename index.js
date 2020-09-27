const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const dotenv = require('dotenv');


//let blockChainModel = require("../model/model");
dotenv.config();
//imports routes
const authRoute = require('./routes/UserWebServices');
const postRoute = require('./routes/posts');
const mailRoute = require('./routes/mail');
const blockchainRoute = require('./routes/BlockchainWebServices');
 //connect to db
mongoose.connect(process.env.DB_CONNECT,{useUnifiedTopology: true,useNewUrlParser : true,useFindAndModify: true},
()=>console.log('connect to db!!')
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });


// middlware

app.use(express.json());
app.use(bodyParser.json());
//route middlwares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/mails', mailRoute);
app.use('/api/blocks',blockchainRoute);

app.listen(4000, ()=>console.log('server up and running'));



