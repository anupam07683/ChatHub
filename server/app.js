require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Users = require('./models/UserModel');
const Threads = require('./models/ThreadModel');
const Messages = require('./models/MessageModel');
const Utils = require('./utils/thread');

//const url = 'mongodb://localhost:27017/ChatIo';
const url = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0-vsr71.mongodb.net/${process.env.databse}?retryWrites=true&w=majority`
const connect = mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true });
connect.then((db) => {
    console.log("Connected correctly to mongodb server ");
}, (err) => { console.log(err); });


server.listen((process.env.PORT || 8000),() => {
    console.log(`server running on port ${server.address().port}`);
});


const passport = require('passport');
const authenticate = require('./authenticate');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use(session({name:'session-id',secret:'one-man-army',saveUninitialized:false,resave:false}));
app.use(passport.initialize());
app.use(passport.session());


const userRouter = require('./routes/userRoute');
const chattingRouter = require('./routes/chattingRouter');

app.use('/user',userRouter);
app.use('/chatting',chattingRouter);

app.get('/*',(req,res) => {
    res.sendFile(path.join(__dirname,'build/index.html'))
})

io.sockets.on('connection',(socket) => {

    //Store Socket in user 
    socket.on('get connected',(user) => {
        socket.join(`${user._id}`)    
    })

    //Disconnect
    socket.on('disconnect',(socket) => {
        console.log('disconnected!');
    });

    //Send Message
    socket.on('send message',(data) => {
        Utils.getThread(data.sender,data.receiver,(err,thread) => {
            if(err)
            {
                console.log(err);
            }
            else{
                Messages.create({sender:data.sender._id,message:data.newMessage,thread:thread._id,seen:false})
                .then(message => { 
                    Messages.findOne({_id:message.id})
                    .populate('thread')
                    .then(message => {
                        io.to(data.sender._id).emit('new message',{message});
                        io.to(data.receiver._id).emit('new message',{message});
                    })
                    .catch(err => { console.log('error',err) });
                })
                .catch(err => { console.log('error',err)});
            }
        });   
    });

    socket.on('set_seen_true',(participant1,participant2) => {
        let sender = {};
        let receiver = {};
        sender._id = participant1;
        receiver._id = participant2;
        Utils.getThread(sender,receiver,(err,thread) => {
            if(err){
                console.log(err.message);
            }else{
                Messages.updateMany({sender:{$ne:sender._id},thread:{ $in :thread}},{seen:true})
                .then((messages) => {
                    io.to(receiver._id).emit('seen',{receiver:sender._id})
                })
            }
        })
    })
})
