const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const userSchema = new Schema({
    userHandle:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    accountDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"profile",
    },
    questionSolved:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"questions"
    }
});

module.exports = mongoose.model('user',userSchema);
