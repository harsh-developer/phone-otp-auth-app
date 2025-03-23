const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/route/route');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.options('*', cors()); // Handle preflight requests
app.use(cors({
    origin: '*',  // Allow requests from all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true  // allow credentials like cookies, authorization headers
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB is connected..."))
    .catch(err => console.log(err));

app.use("/", route);

app.get('/test', (req, res) => {
    res.send('Hello World!');

})

app.listen(process.env.PORT || 5000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5000));
});


// module.exports.handler = serverless(app);