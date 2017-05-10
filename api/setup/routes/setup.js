let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Counter = require('../../shared/model/counter'),
    Game = require('../../games/model/game'),
    Score = require('../../score/model/score'),
    User = require('../../user/model/user'),
    GridGame = require('../../gridgame/model/gridgame'),
    Team = require('../../teams/model/team');

router.get('/',function(request, response) {
    // Setup counters
    Counter.remove({},(error) => {
        if(!error) {
            console.log("Removing all counters: Success");
        }
        else {
            console.log("Removing all scorcounterses: Failed -> %s",err);
        }
    });

    let counters = ['Game','GridGame','Score','Team','User'];
    for(iCount = 0; iCount < counters.length; iCount++) {
        let scoreCounter = new Counter({
                entityType: counters[iCount],
                counter: 1
            });
            scoreCounter.save((error) => {                
                if(!error) {
                    console.log('Save %s counter : Success',scoreCounter.entityType);
                }
                else {
                    console.log('Save %s counter : Failed -> %s',scoreCounter.entityType, error);
                }
            });
    }

    Score.remove({},(error) => {
        if(!error) {
            console.log("Removing all scores: Success");
        }
        else {
            console.log("Removing all scores: Failed -> " + err);
        }
    });

    Game.remove({},(error) => {
        if(!error) {
            console.log("Removing all games: Success");
        }
        else {
            console.log("Removing all games: Failed -> " + err);
        }
    });

    Team.remove({},(error) => {
        if(!error) {
            console.log("Removing all teams: Success");
        }
        else {
            console.log("Removing all teams: Failed -> " + err);
        }
    });

    GridGame.remove({},(error) => {
        if(!error) {
            console.log("Removing all GridGame: Success");
        }
        else {
            console.log("Removing all GridGame: Failed -> " + err);
        }
    });

    User.remove({},(error) => {
        if(!error) {
            console.log("Removing all users: Success");
        }
        else {
            console.log("Removing all users: Failed -> " + err);
        }
    });


    // NFC East
    let team1 = new Team({
        location: "New York",
        teamName: "Giants",
        shortName: "NYG",
        logoUri :  "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/nyg.png&h=50",
        teampageUri : "http://www.espn.com/nfl/team/_/name/nyg/new-york-giants"
    });
    let team2 = new Team({
        location: "Dallas",
        teamName: "Cowboys",
        shortName: "DAL",
        logoUri :  "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/dal.png&h=50",
        teampageUri : "http://www.espn.com/nfl/team/_/name/dal/dallas-cowboys"
    });
    let team3 = new Team({
        location: "Philadelphia",
        teamName: "Eagles",
        shortName: "PHI",
        logoUri :  "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/phi.png&h=50",
        teampageUri : "http://www.espn.com/nfl/team/_/name/phi/philadelphia-eagles"
    });
    let team4 = new Team({
        location: "Washington",
        teamName: "Redskins",
        shortName: "WAS",
        logoUri :  "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/was.png&h=50",
        teampageUri : "http://espn.go.com/nfl/team/_/name/wsh/washington-redskins"
    });

    let teams = [team1, team2, team3, team4];
    
    let teamsUpdated = [];
    let teamsUpdatedError = [];

    console.log('Saving all teams');
    for(let idx = 0; idx< teams.length; idx++) {
        let team = teams[idx];
        team.save((error) => {
            if(!error) {
                teamsUpdated.push(team.shortName);
                console.log('Save '+team.shortName+': successful');
            }
            else {
                teamsUpdatedError.push(team.shortName);
                console.log('Save '+team.shortName+': error ->' + error);
            }
        });
    }

    var scoreGame1 = new Score({
        homeTeamScore: 30,
        awayTeamScore: 17,
        currentPeriod: "4th quarter",
        currentTime: "8:58",
        homeTeamPeriodScores: [3,3,10,14],
        homeTeamTotalScores: [3,6,16,30],
        awayTeamPeriodScores: [7,7,0,3],
        awayTeamTotalScores: [7,14,0,17],
        periodNames: ["1","2","3","4"]
    });

var users = [
new User({
            firstName: "Ricky",
            lastName: "Patel",
            username: "rickypatel",
            password: "test",
            email: "rickypatel9@gmail.com",
        }),
        new User({
            firstName: "Adlus",
            lastName: "Dumbeldore",
            username: "ad",
            password: "test2",
            email: "ad@hogwarts.com",
        }),
];

        users.forEach(function(user) {
            user.save((error2) =>{
                    if(!error2) {
                        console.log("Save user " + user.firstName + ": successful");
                    }
                    else {
                        console.log("Save user" + user.firstName + ": error => "+ error2);
                    }
                });
        }, this);

        
        
        var gridGame1 = new GridGame({
            name: "Grid game 1",
            owner: users[0]._id
        });

        var gridGame2 = new GridGame({
            name: "Grid game 2",
            accessCode: "5sake2",
            owner: users[0]._id
        });

        var gridGame3 = new GridGame({
            name: "Grid game 3",
            owner: users[1]._id
        });



    scoreGame1.save((errorScore) => {
        if(!errorScore) {
            
            console.log("Save score: Success");
            var game1 = new Game({
                homeTeam : team1._id,
                awayTeam: team2._id,
                gameDate : "2016-10-13T13:30:00Z",
                isActive : true,
                score: scoreGame1._id,
                gamePeriod: 8
            });
            game1.save((errorGame)=>{
                if(!errorGame) {
                    console.log('Save Game1: successful');
                
                    gridGame1.game = game1._id;
                    gridGame2.game = game1._id;
                    gridGame3.game = game1._id;

                    gridGame1.boxes.push({
                        userId: users[0]._id
                    });
                    gridGame1.boxes.push({
                        userId: users[0]._id
                    });
                    gridGame2.boxes.push({
                        userId: users[0]._id
                    });
                    gridGame3.boxes.push({
                        userId: users[1]._id
                    })

                    gridGame1.save((gridGame1erorr) => {
                        if(!gridGame1erorr) {
                            console.log("Save gridGame1: successful");
                        }
                        else {
                            console.log("Save gridGame1: error => "+ gridGame1erorr);
                        }
                    });
                    gridGame2.save((gridGame2erorr) => {
                        if(!gridGame2erorr) {
                            console.log("Save gridGame2: successful");
                        }
                        else {
                            console.log("Save gridGame2: error => "+ gridGame2erorr);
                        }
                    });
                    gridGame3.save((gridGame3erorr) => {
                        if(!gridGame3erorr) {
                            console.log("Save gridGame2: successful");
                        }
                        else {
                            console.log("Save gridGame2: error => "+ gridGame3erorr);
                        }
                    });
                }
                else {
                    console.log('Save Game1: error ->' + errorGame);
                }
                
            });
        }
        else {
            console.log("Save score: Failed -> " + errorScore);
        }
    });
    
    response.json('Save successful');
});

module.exports = router;