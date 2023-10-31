const requestQuestions = require('../model/requestQuestions');
const allQuestions = require('../model/adminQuestions');
const user = require('../model/userSchema');
const questions = require('../model/questions');
const profile = require('../model/profile');
const allSubmission = require('../model/allSubmission');
exports.getAllRequestedQuestions = async(req,res)=>{
    try{
        const response = await requestQuestions.findMany({});

        return res.status(200).json({
            success:true,
            response:response,
            message:"all requested questions fetched successfully",
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"error while fetching"
        });
    }
}


exports.getAllQuestons = async(req,res)=>{
    try{
        // console.log('here');
        const {userHandle} = req.body;
        const questionsList = await allQuestions.find({});

        if(userHandle == null || questionsList == null){
            // console.log('user is not login');
            return res.status(200).json({
                questionsList
            });
        }
        // console.log(userHandle);
        // console.log('user is login and checking which quedtions done by user',userHandle);

        const currUser = await user.findOne({userHandle:userHandle})
        // console.log(currUser);

        const userQuestion = await questions.findById(currUser.questionSolved);

        const userSolvedQuestionList = userQuestion.total;
        // console.log('sdfgdsfg',userSolvedQuestionList);


        for(let i = 0;i < questionsList?.length;i++) {
            if(userSolvedQuestionList.includes(questionsList[i]._id)){
                questionsList[i].isSolved = true;
            }else{
                questionsList[i].isSolved = false;
            }
        }

        return res.status(200).json({
            questionsList
        });
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:"error while fetching questions"
        });
    }
}

exports.getQuestion = async(req,res)=>{
    try{
        const {id} = req.params;
        const question = await allQuestions.findById(id);
        return res.status(200).json({
            success:true,
            question:question,
            message:"question fetched successfully",
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"error while fetching question"
        });
    }
}

exports.getUserDetails = async(req,res)=>{

    try{
        const {userHandle} = req.params;

        const userDetails = await user.findOne({userHandle:userHandle});
        // console.log(userDetails);
        
        const questionDetails = await questions.findById(userDetails.questionSolved);
        const totalUser =await user.countDocuments({});
        // console.log(questionDetails);
        const userProfile = await profile.findById(userDetails.accountDetails);
        // console.log(userProfile);
        // console.log('i am here');
        const questionSolvedByUser = await allSubmission.find({userHandle: userHandle});
        questionSolvedByUser.reverse();
        

        // console.log('aneretgrfdgh',questionSolvedByUser);

        const totalEasy = await allQuestions.countDocuments({ difficulty: 'easy' });
        const totalMedium = await allQuestions.countDocuments({ difficulty: 'medium' });
        const totalHard = await allQuestions.countDocuments({ difficulty: 'hard' });

        

        const score = questionDetails.score;
        
        const easy = questionDetails.easy;
        
        const medium = questionDetails.medium;
        
        const hard = questionDetails.hard;
        
        const total = questionDetails.total?.length;
        
        userDetails.password = undefined;
        
        userDetails.accountDetails = undefined;
        
        userDetails.questionSolved = undefined;
        // console.log('your score is ',score);
        const rank = await questions.countDocuments({score:{$gt:score}});
        const typeQuestions = {
            easy,
            medium,
            hard,
        }

        const totalData = {
            totalEasy,
            totalMedium,
            totalHard,
            rank,
            totalUser
        }

        userDetails.questionSolved = undefined;
        const response = {
            userDetails,

            totalData,

            userProfile,

            questionSolvedByUser,

            typeQuestions,

            total
        }
        return res.status(200).json({
            success:true,
            response:response,
            message:"user details fetched successfully",
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:"error while fetching user details"
        });

    }
}