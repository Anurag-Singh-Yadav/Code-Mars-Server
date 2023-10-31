const axios = require("axios");
require("dotenv").config();
const allQuestions =require('../model/adminQuestions');
const allSubmissionSchema = require('../model/allSubmission');
const questions = require('../model/questions');
const userSchema = require('../model/userSchema');
const allSubmission = require("../model/allSubmission");
const allDiscussions = require("../model/allDiscussion");

exports.getOutput = async (req, res) => {

  const { code, input , language } = req.body;
  // console.log(code);
  // console.log(input);
  // console.log(language);

  const options = {
    method: "POST",
    url: "https://code-compiler10.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "x-compile": "rapidapi",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": "code-compiler10.p.rapidapi.com",
    },
    data: {
      langEnum: [
        "php",
        "python",
        "c",
        "c_cpp",
        "csharp",
        "kotlin",
        "golang",
        "r",
        "java",
        "typescript",
        "nodejs",
        "ruby",
        "perl",
        "swift",
        "fortran",
        "bash",
      ],
      lang: `${language}`,
      code: `${code}`,
      input: `${input}`,
    },
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data);
    return res.status(200).json({
        success:true,
        message: response.data
    })
  } catch (error) {
    // console.log("Couldn't run the code: " , error);
    return res.status(500).json({
        success:false,
        message: 'Code running failed'
    })
}
};

async function utilityGetOutput(language, code, input) {
  const options = {
    method: "POST",
    url: "https://code-compiler10.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "x-compile": "rapidapi",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": "code-compiler10.p.rapidapi.com",
    },
    data: {
      langEnum: [
        "php",
        "python",
        "c",
        "c_cpp",
        "csharp",
        "kotlin",
        "golang",
        "r",
        "java",
        "typescript",
        "nodejs",
        "ruby",
        "perl",
        "swift",
        "fortran",
        "bash",
      ],
      lang: `${language}`,
      code: `${code}`,
      input: `${input}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.output;
  } catch (error) {
    return "Error";
  }
}

function judge(a, b) {
  function extractWords(str) {
    const words = str.split(/\s+/);
    return words.filter(word => word?.length > 0);
  }
  
  const wordA = extractWords(a), wordB = extractWords(b);

  if (wordA?.length !== wordB?.length) {
    return false;
  }

  for (let i = 0; i < wordA?.length; i++) {
    if (wordA[i] !== wordB[i]) {
      return false;
    }
  }
  return true;
}

exports.submitCode = async (req, res) => {
  try {
    const { code, language, qid,title } = req.body;
    const userHandle = req.user.userHandle;
    const problem = await allQuestions.findById(qid);
    // console.log(problem);
    for(let i = 0 ; i < problem.main?.length ; i++){

      const output = await utilityGetOutput(language , code , problem.main[i]);

      if(!judge(output , problem.mainAnswer[i])){
        const verdict =  `Wrong answer, passed: ${i}/${problem.main?.length}`
        await allSubmissionSchema.create({
          qid:problem._id,
          userHandle: userHandle,
          date: new Date(),
          verdict,
          title,
        })

        return res.status(200).json({
          success: true,
          verdict
        })
      }

    }
    const verdict =`Correct answer, passed: ${problem.main?.length}
    /${problem.main?.length}`
    await allSubmissionSchema.create({
      qid:qid,
      userHandle: userHandle,
      date: new Date(),
      verdict,
      title,
    })

    const person = await userSchema.findOne({userHandle: userHandle});

    const questionInfo = await questions.findById(person.questionSolved);

    if(!questionInfo.total.includes(problem._id)){
      questionInfo.total.push(problem._id)
      if(problem.difficulty == 'easy'){
        questionInfo.easy++;
        questionInfo.score += 5;
      }
      else if(problem.difficulty == 'medium'){
        questionInfo.medium++;
        questionInfo.score += 10;
      }
      else{
        questionInfo.hard++;
        questionInfo.score += 20;
      } 
    }

    questionInfo.save();

    return res.status(200).json({
      success: true,
      verdict,
      title,
    })

  } catch (err) {
    // console.log(err);
    return res.status(403).json({
      success: false,
      message: err.message,
});
}
};

exports.getAllSubmissions = async(req,res)=>{

    try{
      const userHandle = req.user.userHandle;
      const {qid} = req.body;
      // console.log('getAllSubmissions');
      const response = await allSubmission.find({userHandle:userHandle,qid:qid});
      response.reverse();
      return res.status(200).json({
        success: true,
        response
      })
    }catch(e){
      // console.log('error in getAllSubmissions');
      return res.status(500).json({
        success: false,
        message: 'error in getAllSubmissions'
      })
    }

}

exports.getAllDiscussions = async(req, res)=>{
  try{

    const qid = req.params.qid;
    const response = await allDiscussions.find({qid:qid});
    response.reverse();
    return res.status(200).json({
      success: true,
      response
    })

  }catch(e){
    // console.log('error in getAllDiscussions');
    return res.status(500).json({
      success: false,
      message: 'error in getAllDiscussions'
    })

  }
}

exports.postDiscussion = async(req, res)=>{
  try{
    const userHandle = req.user.userHandle;
    const {qid,title,body} = req.body;
    const response = await allDiscussions.create({
      qid:qid,
      title:title,
      body:body,
      userHandle:userHandle,
      date:new Date(),
    })
    return res.status(200).json({
      success: true,
      response
    })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: 'error in postDiscussion'
    })
  }
}

exports.deleteDiscussion = async (req,res)=>{
  try{
    const userHandle = req.user.userHandle;
    const {_id }  = req.body;
    // console.log(_id);
    const discussion = await allDiscussions.findById(_id);
    // console.log(discussion);

    if(discussion.userHandle != userHandle){
      return res.status(403).json({
        success: false,
        message: 'You are not authorised to delete this discussion'
      })
    }
    await allDiscussions.findByIdAndDelete(_id);
    return res.status(200).json({
      success: true,
      message: 'Discussion deleted successfully'
    })

  }catch(e){
    return res.status(500).json({
      success: false,
      message: 'error in deleteDiscussion'
    })
  }
}