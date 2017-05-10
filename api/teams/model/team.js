let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Counter = require('../../shared/model/counter');

const teamSchema = new Schema({
    location: { type: String, required: true},
    teamName: { type: String, required: true}, 
    shortName: { type: String, required: true},
    logoUri: { type: String, required: true}, 
    teampageUri: { type: String, required: true},
    teamId : {type: Number}
});

teamSchema.pre('save', function(next) {
    var team = this;
    Counter.findOneAndUpdate({entityType: 'Team'}, {$inc: { counter: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        team.teamId = counter.counter;
        next();
    });
})

let Team = mongoose.model('Team', teamSchema);
module.exports = Team;