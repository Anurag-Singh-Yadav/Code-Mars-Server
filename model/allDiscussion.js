const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allDiscussions = new Schema({
    qid:{
        type:Schema.Types.ObjectId,
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    userHandle:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:new Date(),
    }
})

module.exports = mongoose.model("allDiscussions",allDiscussions);