var express = require('express'),
    path = require('path'),
    app = express(),
    User = require('../model/user'),
    jwt    = require('jsonwebtoken'),
    config = require('../../../config'),
    GridGame = require('../../gridgame/model/gridgame');

app.set('superSecret', config.secret); // secret variable

var router = express.Router();

router.get('/',  function(request, response){
    console.log('get all users');
    User.find({})
        .exec((error, users) => {
            if(!error) {
                response.json(users);
            }
            else {
                response.json('error getting users. Error=' + error);
            }
        });
});

router.post('/save',  function(request, response){
    console.log("Save User");
    response.json('Save user');
});

router.post('/authenticate', function(request, response) {
    var userRequest = request.body;
    console.log(request.body);
    User.getAuthenticated(userRequest.username, userRequest.password, (err, user, reason, unlockTime) => {
        if(err) throw err;

        let message = '';

        if(user) {
            var tempSecret = app.get('superSecret');
            console.log('Secret in user: ' + tempSecret);
            var token = jwt.sign(user, tempSecret, 
                {expiresIn: 1440 // expires in 24 hours
            });
            response.json({success: true, messsage: '', token: token, user: user })
        }
        else {
            var reasons = User.failedLogin;
            
            switch (reason) {
                case reasons.NOT_FOUND:
                case reasons.PASSWORD_INCORRECT:
                    message = 'Invalid username and/or password';
                    break;
                case reasons.MAX_ATTEMPTS:
                    message = 'Max password attempts has been reached. Account will be unlocked after ' + unlockTime;
                    break;
            }
            response.status(404).json(
                {
                    success: false,
                    message: message,
                    token: null
                });
        }
        
    });
});

router.post('/register', function(request, response) {
    console.log("register new user");
    
    var user = request.body;
    
    var newUser = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        password: user.password, 
        email: user.email,
    });

    newUser.save((err) => {
        response.status(200).send(newUser.toJSON());
    });
});

module.exports = router;


