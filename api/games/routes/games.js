var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Game = require('../model/game');
var Score = require('../../score/model/score');
var Team = require('../../teams/model/team');

router.post('/',function(request, response) {
    var gamesRequest = request.body;
    console.log(request.body);

    if(gamesRequest == undefined) {
        console.log(gamesRequest);
        response.status(405).json('');
    }
    else if(gamesRequest != undefined && gamesRequest.games != undefined && Array.isArray(gamesRequest.games) &&  gamesRequest.games.length == 1) {
        
        // find a single game
        Game.findOne({ 'gameId': gamesRequest})
                    .populate('score')
                    .populate('homeTeam')
                    .populate('awayTeam')
                    .exec((error, games) => {
                        if(!error) {
                            response.json(games);
                        }
                        else {
                            response.status(404).json('error getting games. Error=' + error);
                        }
                    });     
    }
    else if(gamesRequest != undefined && gamesRequest.currentPeriod != undefined && Number.isInteger(gamesRequest.currentPeriod)) {
        
        Game.find({'gamePeriod': gamesRequest.currentPeriod})
            .populate('score')
            .populate('homeTeam')
            .populate('awayTeam')
            .exec((error, games) => {
                if(!error) {
                    response.json(games);
                }
                else {
                    response.json('error getting games. Error=' + error);
                }
            });
    }
    else {
        response.status(405).json('');
    }
    



    });

module.exports = router;