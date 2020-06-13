const Threads = require('../models/ThreadModel');

module.exports.getThread = (sender,receiver,callback) => {
    //console.log('finding thread for sender %s and receiver %s',sender,receiver);
    Threads.findOne({ $or : [{participant1:sender._id,participant2:receiver._id},{participant1:receiver._id,participant2:sender._id}]})
    .then(thread => {
        if(thread == null){
            Threads.create({participant1:sender._id,participant2:receiver._id})
            .then( thread => {
                callback(null,thread);
            } )
            .catch( err => callback(err,null) )
        }else{
            callback(null,thread);
        }
    })
    .catch( err => callback(err,null))  
}