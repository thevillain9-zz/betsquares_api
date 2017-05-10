let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Game = require('../../games/model/game'),
    User = require('../../user/model/user'),
    GridGame = require('../model/gridgame');

router.post('/save',  function(request, response){
    console.log("Save grid game");
    response.json('Save grid game');
});


router.get('/',function(request, response) {
        console.log('get all gridgames');
        
        if(request.query != null && request.query.gridGames != null) {
            var games = request.query.gridGames;
            console.log("Find GridGames: " + games);
            GridGame.findById(games[0])
                    .populate('game')
                    .exec(function(error,gridGame){
                        if(!error) {
                            response.json(gridGame);
                        }
                        else {
                            return response.json("Get grid game error : " + error);
                        }
                    });
        }
        else {
            response.json('all gridgames');
        }
});

router.get('/gameId/:gameId',function(request, response) {
        const gameId = request.params.gameId;
        console.log('get all gridgames by gameId: ' + gameId);
        
        Game.findOne({ 
                'gameId': gameId,                
            })
            .exec((errorGame, game) => {
                if(!errorGame) {
                    GridGame.find({
                        game: game._id,
                        'accessCode' : { $exists: false }
                    })
                            .exec(function(errorGridGame,gridGames){
                                if(!errorGridGame) {
                                    response.json(gridGames);
                                }
                                else {
                                    return response.json("Get grid game error: " + errorGridGame);
                                }
                            });
                }
                else {
                    response.status(404).json('Get game error: ' + errorGame);
                }
            });     
});

router.get('/userId/:userId',function(request, response) {
        const userId = request.params.userId;
        console.log('get all gridgames by userId: ' + userId);
        
        User.findOne({'userId':userId})
            .exec((errorUser, user) => {
                
                if(!errorUser) {
                    GridGame.find({'boxes': {$elemMatch: {userId: user._id}}})
                            .populate('game')
                            .populate({
                                path: 'game',
                                populate: { path: 'homeTeam'}
                            })
                            .populate({
                                path: 'game',
                                populate: { path: 'awayTeam'}
                            })
                            .populate({
                                path: 'game',
                                populate: { path: 'score'}
                            })
                            .exec((errorBox, gridGames) => {
                                    if(!errorBox) {
                                        var games = new Map();

                                        gridGames.forEach(function(gridGame) {
                                            if(games.get(gridGame.game.gameId) != gridGame.game) {
                                                // add to list
                                                games.set(gridGame.game.gameId,{
                                                    game: gridGame.game,
                                                    gridGames: []
                                                });
                                            }
                                            
                                            let temp = games.get(gridGame.game.gameId);
                                            temp.gridGames.push({
                                                gridGameId: gridGame.gridGameId,
                                                name: gridGame.name,
                                                boxes: gridGame.boxes
                                            });
                                        }, this);
                                        response.json(Array.from(games.values()));
                                    }
                                    else {
                                        response.status(404).json('Get GridGame error: '+ errorBox);
                                    }
                            });
                }
                else {
                    response.status(404).json('Get UserId error: '+ errorUser);
                }
                

            });
});

module.exports = router;
