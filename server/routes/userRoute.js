const express = require('express');
const router = express.Router();
const passport = require('passport');
const User  = require('../models/UserModel');
const authenticate = require('../authenticate');
const cors = require('./cors');

router.route('/signup')
  .options(cors.corsWithOptions,(req,res) => {res.sendStatus(200)})
  .post(cors.cors,(req, res, next) => {
    console.log(req.body);
    User.register(new User({username: req.body.username}), 
      req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
          passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    });
  });
  
  router.route('/login')
    .options(cors.corsWithOptions,(req,res) => {res.sendStatus(200)})
    .post(cors.cors, passport.authenticate('local'), (req, res) => {
      console.log('request received',req.body);
      if(!req.user){
          res.statusCode = 407;
          res.setHeader('Content-Type','application/json');
          res.json({success: false,status: ' login failed'});
      }
      else{
          res.statusCode = 200;
          const token = authenticate.getToken({id:req.user._id});
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true,user:{username:req.user.username,_id:req.user._id,socket:req.user.socket},token, status: 'You are successfully logged in!'});
      }  
  });

router.post('./logout',cors.cors,(req,res,next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
})
module.exports = router;