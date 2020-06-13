const express = require('express');
const router = express.Router();
const cors = require('./cors');
const mongoose = require('mongoose');
const Messages = require('../models/MessageModel');
const Threads = require('../models/ThreadModel');
const Users  = require('../models/UserModel');
const auth = require('../authenticate');

router.route('/getmessages')
    .options(cors.corsWithOptions,(req,res) => {res.sendStatus(200)})
    .get(cors.cors,auth.verifyUser,(req,res) => {
        Threads.find({$or : [{participant1:mongoose.Types.ObjectId(req.user._id)}, {participant2:mongoose.Types.ObjectId(req.user._id)}]},{_id:1})
        .then(threads => {
            let th = [];
            for(thread of threads){
                th.push(mongoose.Types.ObjectId(thread._id));
            };
            
            Messages.find({thread:{ $in :th}})
            .populate('thread')
            .then(messages => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({success:true,messages:messages});
            })
        })
        .catch(err => {
            res.statusCode = 307;
            res.setHeader('Content-Type','application/json');
            res.json({success:false,messages:[],status:'failed to fetch messages',error:err});
        })
    })
    .put(cors.corsWithOptions,auth.verifyUser,(req,res) => {
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        res.json({success:fasle,users:[],status:'put not supported on this route'});
    })
    .post(cors.corsWithOptions,auth.verifyUser,(req,res) => {
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        res.json({success:fasle,users:[],status:'post not supported on this route'});
    })
    .delete(cors.corsWithOptions,auth.verifyUser,(req,res) => {
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        res.json({success:fasle,users:[],status:'delete not supported on this route'});
    })
    
    

router.route('/getconnectedusers')
    .options(cors.corsWithOptions,(req,res) => {res.sendStatus(200)})
    .get(cors.cors,auth.verifyUser,(req,res) => {
        Users.find({_id : {$ne : req.user._id}})
        .then(users => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true,users});
        })
        .catch(err => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:fasle,users:[],status:'error fetching users'});
        })
    })
    .put(cors.corsWithOptions,auth.verifyUser,(req,res) => {
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        res.json({success:fasle,users:[],status:'put not supported on this route'});
    })
    .post(cors.corsWithOptions,auth.verifyUser,(req,res) => {
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        res.json({success:fasle,users:[],status:'post not supported on this route'});
    })
    .delete(cors.corsWithOptions,auth.verifyUser,(req,res) => {
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        res.json({success:fasle,users:[],status:'delete not supported on this route'});
    })
    
module.exports = router;