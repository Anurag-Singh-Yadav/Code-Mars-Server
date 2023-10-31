const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allSubmission = new Schema({
    qid:{
        type:Schema.Types.ObjectId,
    },
    userHandle:{
        type:String,
        required:true
    },
    verdict:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
    }
})

module.exports = mongoose.model("allSubmission",allSubmission);