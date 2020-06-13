const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const Jwt = require('jsonwebtoken');
const User = require('./models/UserModel');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = 'secret';


passport.use(new JwtStrategy(options,(jwt_payload,done) => {
    User.findOne({_id:jwt_payload.id},(err,user) => {
        if(err){
            return done(err,false);
        }else if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    })
}))

exports.getToken = (user) => {
    return Jwt.sign(user,'secret',{expiresIn:36000})
}

exports.verifyUser = passport.authenticate('jwt',{session:false});