const requestQuestions = require('../model/requestQuestions');
const user = require('../model/userSchema');
const profile = require('../model/profile')
exports.userReqAddQues = async (req, res) => {
    try{
        const {author ,title, difficulty, description,sample, main,sampleAnswer,mainAnswer} = req.body;
        // console.log(req.body);
        if(!author || !title || !difficulty || !description || !sample || !main || !sampleAnswer || !mainAnswer){
            console.log('every field is required');
            return res.status(404).json({
                success: false,
                message: "Please enter field",
            })
        }
        const response = await requestQuestions.create({
            author: author,
            title: title,
            difficulty: difficulty,
            description: description,
            sample: sample,
            main: main,
            sampleAnswer: sampleAnswer,
            mainAnswer: mainAnswer
        })

        return res.status(200).json({
            success: true,
            message: "your request send successfully",
            response,
        })
    }catch(e){
        // console.log('error in adding user request to add questions');
        return res.status(404).json({
            success: false,
            message:"Error adding user request to add questions",
        })
    }
};

exports.editProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dob,
      contact,
      about,
      country,
      linkedin,
      github,
      twitter,
    } = req.body;
    const userHandle = req.user.userHandle;

    if (userHandle !== req.params.userHandle) {
      return res.status(403).json({
        success: false,
        message: "not authorized",
      });
    }

    const currUser = await user.findOne({ userHandle: userHandle });

    if (!currUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userProfile = currUser.accountDetails;

    const response = await profile.findOneAndUpdate(
      { _id: userProfile },
      {
        firstName,
        lastName,
        gender,
        dob,
        contact,
        about,
        country,
        linkedin,
        github,
        twitter,
      }
    );

    if (response) {
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  } catch (e) {
    console.error('Error in updating profile:', e);
    return res.status(500).json({
      success: false,
      message: "Error in updating profile",
    });
  }
};
