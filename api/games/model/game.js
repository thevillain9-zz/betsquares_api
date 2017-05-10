let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Counter = require('../../shared/model/counter');

const gameSchema = new Schema({
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true},
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true},
    gameDate : { type: Date, required: true},
    isActive : { type: Boolean, required: true},
    score : { type: mongoose.Schema.Types.ObjectId, ref: 'Score' },
    gameId : { type: Number},
    gamePeriod : { type: Number, required: true}
});

gameSchema.pre('save', function(next) {
    var game = this;
    Counter.findOneAndUpdate({entityType: 'Game'}, {$inc: { counter: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        game.gameId = counter.counter;
        next();
    });
})


var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
