const express = require('express');
var app = express();
const session = require('express-session');
app.use(session({secret: 'codingdojo'}));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mddrdb');
mongoose.Promise = global.Promise
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/mddr-app/dist'));
var path = require('path');

app.listen(8000, function() {
    console.log("Listening on port 8000")
})