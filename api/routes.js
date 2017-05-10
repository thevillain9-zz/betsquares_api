module.exports = function(app) {
    app.use('/api/users', require('./user/routes/user'));
    app.use('/api/games', require('./games/routes/games'));
    app.use('/api/gridgame', require('./gridgame/routes/gridgame'));
    app.use('/api/scores', require('./score/routes/score'));
    app.use('/api/teams', require('./teams/routes/team'));
    app.use('/api/setup', require('./setup/routes/setup'));
};