let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Score = require('../model/score'),
    Game = require('../../games/model/game');

router.get('/',  function(request, response){
    console.log(request.query.games);
     if(request.query != null && request.query.games != null) {
        console.log("Load score games: " + request.query.games);
        Game.find({ 
                    'gameId': { $in : request.query.games},
                })
            .populate('score')
            .exec((error, games) => {
                if(!error) {
                    let scores = [];
                    games.forEach(function(game) {
                        scores.push({
                            score: game.score,
                            gameId: game.gameId
                        });
                    }, this);
                    response.json(scores);
                }
                else {
                    console.log(error);
                    response.status(404).json(error);
                }
        });
     }
     else {
         response.status(404).json('bad bad bad');
     }
});


module.exports = router;