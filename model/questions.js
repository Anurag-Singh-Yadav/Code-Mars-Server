const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionsSchema = new Schema({
    easy:{
        type:Number,
        default:0,
    },
    medium:{
        type:Number,
        default:0,
    },
    hard:{
        type:Number,
        default:0,
    },
    score:{
        type:Number,
        default:0,
    },
    total:{
        type:[{
            type:Schema.Types.ObjectId,
        }],
    },
});
module.exports = mongoose.model('questions',questionsSchema);