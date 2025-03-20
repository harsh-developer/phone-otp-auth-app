const express = require('express');
const mongoose = require('mongoose');
const route = require('./route/route');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)

    .then(() => console.log("MongoDb is connected..."))
    .catch(err => console.log(err))



app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});