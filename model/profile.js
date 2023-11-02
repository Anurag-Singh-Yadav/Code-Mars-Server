const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const userProfile = new Schema({
    firstName:{
        type: String,
        default: null,
        trim:true,
    },
    lastName:{
        type: String,
        default: null,
        trim:true,
    },
    gender:{
        type:String,
        default:null,
    },
    dob:{
        type:Date,
        default:null,
    },
    contact:{
        type:String,
        trim:true,
        default:null,
    },
    about:{
        type:String,
        trim:true,
        default:null,
    },
    country:{
        type:String,
        trim:true,
        default:null,
    },
    linkedin:{
        type:String,
        trim:true,
        default:null,
    },
    github:{
        type:String,
        trim:true,
        default:null,
    },
    twitter:{
        type:String,
        trim:true,
        default:null,
    },
    
});

module.exports = mongoose.model('profile',userProfile);
