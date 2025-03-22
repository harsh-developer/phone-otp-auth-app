const express = require('express');
const mongoose = require('mongoose');
const route = require('./route/route');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// CORS Configuration
app.options('*', cors()); // Handle preflight requests
app.use(cors({
    origin: '*',  // Allow requests from Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true  // Allow credentials like cookies, authorization headers
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB is connected..."))
    .catch(err => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 5000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5000));
});