var app = require('express')(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    uriUtil = require('mongodb-uri');


var mongodbUri = 'mongodb://localhost/betsquares';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var dbOptions = {};

// configure


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
var routes = require('./api/routes')(app);



var hostname = 'localhost';
var port = '3009';
app.listen(port, hostname,function() {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongooseUri, dbOptions,(err)=> {
        if(err != null) {
            console.log(err);
        }

    });
    
    console.log(`Server is running at http://${hostname}:${port}`);
})

