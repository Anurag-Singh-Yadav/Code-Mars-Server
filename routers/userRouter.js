const express = require('express');
const router = express.Router();

// import 
const {signup,login ,sendOTP,isUserExist,resetPassword,sendOtpResetPassword} = require('../controller/auth');

const {userReqAddQues,editProfile} = require('../controller/userReqAddQues');
// middleware

const {auth} = require('../middleWare/auth');


// user routers
router.post('/otp',sendOTP);
router.post('/otp/signup',signup);
router.post('/login',login);
router.post('/userReqAddQues',userReqAddQues);
router.post('/editProfile/:userHandle',auth,editProfile);




//authentication
router.post('/user-verfication',auth,(req,res)=>{
    return res.status(200).json({
        success:true,
        user:req.user
    })
});

// controller to reset password
router.post('/sendOtpResetPassword',sendOtpResetPassword);
router.post('/reset-password',resetPassword);
router.post('/isUserExist',isUserExist);

// router that admin use to add questions in db
router.post('/addQuestion')

// import of get router
const {getAllRequestedQuestions,getAllQuestons,getQuestion,getUserDetails} = require('../controller/getRequest');
// get request

// router.get('/getAllRequestedQuestions',getAllRequestedQuestions)
router.get('/getUserDetails/:userHandle',getUserDetails);
router.post('/getAllQuestons',getAllQuestons);
router.get('/getquestion/:id',getQuestion);

module.exports = router;