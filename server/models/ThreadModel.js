const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    participant1:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    participant2:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps:true})

const Threads =  mongoose.model('Threads',ThreadSchema);
module.exports = Threads;