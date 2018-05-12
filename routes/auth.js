const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/users');

router.post('/login', (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email: email}, (err, user) => {
        if (err) console.log(err);

        user.comparePassword(password, (err, result) => {
           if (err) console.log(err) 
                if(!result) res.status(403).json({message: 'Wrong Password'});

            var token = jwt.sign({
                email: email
              }, process.env.SECRET, { expiresIn: '1h' });
              return res.status(200).json({token: token});
        });
    });
});


router.post('/register', (req, res, next) => {
    var dataUser = {
        name     : req.body.name,        
        username : req.body.username,
        email    : req.body.email,        
        password : req.body.password
    } 

    var queryMongodb = { username: dataUser.username }
    
     User.findOne(queryMongodb, (err, result) => {
        console.log(result);
        
       if (result) {
          res.status(403).json({message: "Username Or Email Already taken"});
        } else {
         
       var user = new User(dataUser);
          user.save((err) => {
              
             if (err) {
               res.status(403).json({message: 'Failed to registered User'});
            } else {
              res.status(200).json({message: 'Sucess to registered User'});                
            }

        });    
      }
   });
});

module.exports = router;