const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestQuestionSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty:{
    type: String,
    enum:['easy','medium','hard'],
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  sample: {
    type: String,
    required: true,
  },
  main:{
    type: [String],
    required: true,
  },
  sampleAnswer: {
    type: String,
    required: true,
  },
  mainAnswer: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("requestQuestions", requestQuestionSchema);
