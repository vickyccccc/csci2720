const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open...");

    // your Schema and Model here

    // your Task 1 here

    // your Task 2 here

    // your Task 3 here

    // your Task 4 here

    // handle ALL requests with Hello World
    app.all('/*', (req, res) => {
        res.send('Hello World!');
    });

})
// listen to port 3000
const server = app.listen(3000);