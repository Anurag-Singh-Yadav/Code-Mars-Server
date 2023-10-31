const user = require("../model/userSchema");
const questions = require('../model/questions');
const profile = require('../model/profile');
const bcrypt = require("bcrypt");
const OTP = require('../model/otp');
const otpGenerator = require('otp-generator');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");  
const fs = require('fs');
const ejs = require('ejs');
const mailSender = require('../utilis/mailSender');
const path = require('path');
const ejsTemplatePath = path.join(__dirname, 'otpBody.ejs');
dotenv.config();

exports.isUserExist = async (req,res)=>{
  try{
    const {email,userHandle} = req.body;
    const checkUser = await user.findOne({email});
    // console.log(req.body);
    const checkuserHandle = await user.findOne({userHandle})
    // console.log('i checking wether exist or not');
    if(checkUser || checkuserHandle){
      // console.log("user already exists");
      // console.log(checkUser,checkuserHandle);
      return res.status(400).json({
        success:false,
        message:"User already exists",
      })
    }
    return res.status(200).json({
      success:true,
      message:"User not exists",
    });

  }catch(e){
    // console.log('error in checking user',e);
    return res.status(400).json({
      success:false,
      message:"Error in checking user",
    })
  }

}


exports.signup = async (req, res) => {
  try {
    const { email, userHandle, password,otp } = req.body;
    if(!email || !userHandle || !password || !otp) {
      // console.log('here fhcgvjbn');
      return res.status(403).json({
        status:false,
        message: "all fields required",
      })
    }

    const currUser =  await OTP.findOne({email});
    if(!currUser){
      return res.status(403).json({
        success: false,
        message: "Session time Expired",
      })
    }

    // console.log(currUser.otp);
    if(otp !== (currUser.otp)){
      return res.status(402).json({
        success:false,
        message:"Entered OTP is incorrect",
      })
    }
    // console.log('Hashing password is started');
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (e) {
      // console.log("error in hashing the password", e);
      return res.status(403).json({
        status: false,
        message: "Error in hashing the password",
      });
    }

    const userProfile = await profile.create({});
    const userQuestions = await questions.create({});
    const newUser = await user.create({
      userHandle,
      password: hashedPassword,
      email,
      accountDetails:userProfile._id,
      questionSolved: userQuestions._id,
    });

    return res.status(200).json({
      success: true,
      newUser: newUser,
    });
  } catch (e) {
    // console.log("error in user signup ", e);
    return res.status(400).json({
      success: false,
      message: "Error in user signup",
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please enter all the details",
      });
    }

    let userExist = await user.findOne({ email });
    if (!userExist) {
      return res
        .status(403)
        .json({ success: false, message: "User doesn't exist" });
    }

    if (await bcrypt.compare(password, userExist.password)) {
      // Password match
      // console.log(userExist);
      const payload = {
        userHandle:userExist.userHandle,
        email: userExist.email,  // Corrected variable name
        id: userExist._id,     // Corrected variable name
      };

      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "168h",
      });

      userExist = userExist.toObject();
      userExist.token = token;
      userExist.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token: token,
        user:userExist,
        message: "Logged in successfully",
      });


    } else {
      return res
        .status(403)
        .json({ success: false, message: "Password does not match" });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Something went wrong", err: err });
  }
};


exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let result = await OTP.findOne({ email });
    // console.log(result);
    var otp = null;
    if(result){
      otp = result.opt;
      // console.log('here');
    }
    else{
      otp = otpGenerator.generate(6,{
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false,
      })
      await OTP.create({ email,otp});
    }
    // console.log(otp);
    const otpInfo = {
      title: 'Email verification to Sign up for DSA Tracker',
      purpose: "Thank you for registering with DSA Tracker. To complete your registration, please use the following OTP (One-Time Password) to verify your account:",
      OTP: otp  // Corrected template variable
    };

    // Assuming ejsTemplatePath is defined
    const otpBody = fs.readFileSync(ejsTemplatePath, 'utf-8');
    const renderedHTML = ejs.render(otpBody, otpInfo);

    // Assuming mailSender is defined
    mailSender(email, 'Sign Up verification', renderedHTML);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (e) {
    // console.log('Error in sending OTP ', e);
    return res.status(402).json({
      success: false,
      message: "Error in sending OTP",
    });
  }
};

exports.resetPassword = async(req,res)=>{
  try{  
        // console.log(req.body);
        const {email,password,otp} = req.body;
        if(!email || !password || !otp){
          // console.log('some thing missing');
          return res.status(403).json({
            success:false,
            message:"all fields required",
          })
        }        
        const currUser = await OTP.findOne({email});
        if(!currUser){
          return res.status(403).json({
            success:false,
            message:"Session time Expired",
          })
        }
        if(otp !== currUser.otp){
          return res.status(402).json({
            success:false,
            message:"Entered OTP is incorrect",
          })
        }
        let hashedPassword;
        try{
          hashedPassword = await bcrypt.hash(password,10);
        }catch(e){
          // console.log('error in hashing the password',e);
          return res.status(403).json({
            success:false,
            message:"Error in hashing the password",
          })
        }
        const userToupdate = await user.findOne({email});

        if(!userToupdate){
          return res.status(403).json({
            success:false,
            message:"User not found",
          })
        }
        userToupdate.password = hashedPassword;
        await userToupdate.save();
        return res.status(200).json({
          success:true,
          message:"Password reset successfully",
        })
  }catch(e){
    // console.log('error in resetting password',e);
    return res.status(400).json({
      success:false,
      message:"Error in resetting password",
    })
  }
}


exports.sendOtpResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await user.findOne({ email: email });

    if (!checkUser) {
      return res.status(403).json({
        success: false,
        message: "Account not found",
      });
    }

    let result = await OTP.findOne({ email });

    var otp = null;

    if (result) {
      otp = result.otp;
      // console.log("here", otp);
    } else {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      await OTP.create({ email, otp });
    }

    const otpInfo = {
      title: "Email verification to reset your password",
      purpose:
        "To reset your password, please use the following OTP (One-Time Password) to verify your account:",
      OTP: `${otp}`
    };

    const otpBody = fs.readFileSync(ejsTemplatePath, "utf-8");

    const renderedHTML = ejs.render(otpBody, otpInfo);

    mailSender(email, "Reset password request", renderedHTML);

    return res.status(200).json({
      success: true,
      message: "otp sent successfully",
    });
  } catch (err) {
    // console.log("Error in sending otp: ", err);
    return res.status(402).json({
      success: false,
      message: "error in sending OTP",
});
}
};

