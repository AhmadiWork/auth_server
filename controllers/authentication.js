const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
}

exports.signin = function (req, res, next) {
    return res.json({token: tokenForUser(req.user)});
};

exports.signup = function (req, res, next) {
    // Get req body
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({error: 'Email or Password filed is empty'});
    }

    // Check for existing user
    User.findOne({email: email}, function (err, existingUser) {
        if (err) {
            return next(err);
        }

        // if user exist
        if (existingUser) {
            return res.status(422).send({error: 'User is exist!'});
        }

        // if user NOT exist
        const user = new User({
            email: email,
            password: password
        });

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            // Response
            return res.json({token: tokenForUser(user)});
        })
    });
};