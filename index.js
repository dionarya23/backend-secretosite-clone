const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
var morgan       = require('morgan');
require('./config/mongodbConfig')(mongoose);
require('dotenv').config();
const app   = express();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

var Auth    = require('./routes/auth');
var Message = require('./routes/message');

app.use('/auth', Auth);
app.use('/message', Message);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(process.env.PORT, () => {
    console.log(`Running On Port ${process.env.PORT}`);
});