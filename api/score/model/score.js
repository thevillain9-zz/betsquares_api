
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Counter = require('../../shared/model/counter');

const scoreSchema = new Schema({
        scoreId : { type: Number},
        homeTeamScore : { type: Number, required: true},
        awayTeamScore : { type: Number, required: true},
        currentPeriod : { type: String, required: true},
        currentTime : { type: String, required: true},
        homeTeamPeriodScores: { type: [Number]},
        homeTeamTotalScores: { type: [Number]},
        awayTeamPeriodScores: { type: [Number]},
        awayTeamTotalScores: { type: [Number]},
        periodNames: { type: [String]}
    });

var Score = mongoose.model('Score', scoreSchema);

scoreSchema.pre('save', function(next) {
    var score = this;
    Counter.findOneAndUpdate({entityType: 'Score'}, {$inc: { counter: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        score.scoreId = counter.counter;
        next();
    });
})



module.exports = Score;