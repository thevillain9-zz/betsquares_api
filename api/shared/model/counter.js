
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const counterSchema = new Schema({
        entityType : { type: String, required: true},
        counter : { type: Number, default: 0},        
    });

var Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;