var express = require('express');
var jwt     = require('jsonwebtoken');
var router  = express.Router();
var User    = require('../models/users');
var client  = require('../config/redisConfig');
var Message = require('../models/messages');

//midlleware
var CheckQuery = (req, res, next) => {    
    if (!req.query.token) {
        return res.status(404).json({
            message: 'Token Undifined'
        })
    }
    return next();
}

var CheckToken = (req, res, next) => {
    try {
      var decoded = jwt.verify(req.query.token, process.env.SECRET);
        User.findOne({email: decoded.email}, function(err, result) {
            if (err) console.log("Something Error");
                if(!result) {
                    res.status(403).json("User undifined");
                }else{
                    next();
                }
        })
    }catch(err) {
        return res.status(403).json({
            message: 'Undifined Token Or maybe Expired'
        })
    }
}

var getUserMessage = (req, res, next) => {
    Message.findOne({username: req.params.username}, (err, result) => {
        if (err) return res.status(403).json({message: "Something Error"});
        client.hmset(req.params.username, result, 3600);
        res.status(200).json(result);
    });
}

var chaced = (req, res) => {
    var username = req.params.username;
    client.hgetall(username, function (err, data) {
        if (err) throw err;

        if (data != null) {
            res.status(200).json(data);
        } else {
            next();
        }
    });    
}


router.get('/:username', CheckQuery, CheckToken, chaced, getUserMessage);

router.post('/submit', CheckQuery, CheckToken, (req, res, next) => {
    var username     = req.body.username,
        valueMessage = req.body.valuemessage;
        
    var message = new Message({ 
          username: username,
          valueMessage: valueMessage
        });

    message.save((err) => {
        if (err) console.log(err);
        res.status(200).json({message: "Success Create Message"});
    });
});

module.exports = router;