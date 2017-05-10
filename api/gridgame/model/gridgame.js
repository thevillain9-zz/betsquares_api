// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

const gridGameSchema = new Schema({
    gridGameId : { type: Number},
    name : { type: String, required: true},
    accessCode : { type: String},
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    game : {type: Schema.Types.ObjectId, ref: 'Game'},
    boxes : [
        {   
            scoreX : { type: Number, max: 9, min: 0},
            scoreY : { type: Number, max: 9, min: 0},
            userId : {type: Schema.Types.ObjectId, ref: 'User', required: true}
        }
    ],
});

gridGameSchema.pre('save', function(next) {
    var gridGame = this;
    Counter.findOneAndUpdate({entityType: 'GridGame'}, {$inc: { counter: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        gridGame.gridGameId = counter.counter;
        next();
    });
})

var GridGame = mongoose.model('GridGame', gridGameSchema);
module.exports = GridGame;