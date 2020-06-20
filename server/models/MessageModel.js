const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesModel = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    thread:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Threads'
    },
    message:{
        type:String
    },
    seen : {
        type : Boolean,
        default : false
    }
},{timestamps:true})

const Messages =  mongoose.model('Messages',MessagesModel);
module.exports = Messages ;