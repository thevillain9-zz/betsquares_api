
let mongoose = require('mongoose');
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    Counter = require('../../shared/model/counter');
// var bcrypt = require("bcrypt-nodejs");

let SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 4,
    LOCK_TIME = 2 * 60 * 60 * 1000; // 2 x 60 minutes x 60 seconds x 1000 milliseconds= 2hrs


const userSchema = new Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true}, 
    username: { type: String, required: true, unique: true, index: { unique: true}},
    password: { type: String, required: true}, 
    email: { type: String, required: true},
    userId: { type: Number},
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

userSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', function(next) {
    var user = this;
    
    if(user.userId === undefined) {
        // no user id defined
        Counter.findOneAndUpdate({entityType: 'User'}, {$inc: { counter: 1} }, function(error, counter)   {
                if(error)
                    return next(error);
                user.userId = counter.counter;
                next();
            });
    }
    else {
        next();
    }
});


userSchema.pre('save', function(next) {
    var user = this;
    
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, null, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.toJSON = function() {
    var user = this.toObject();
    delete user.password;
    return user;
};

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

var reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

userSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) {

        let unlockTime = Date.now() + LOCK_TIME;
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND, null);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS, unlockTime);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT, null);
            });
        });
    });
};

// set up a mongoose model and pass it using module.exports
var User = mongoose.model('User', userSchema);
module.exports = User;