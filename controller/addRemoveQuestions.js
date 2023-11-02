const allQuestions = require("../model/adminQuestions");
const requestQuestions = require("../model/requestQuestions");

exports.pushQuestion = async (req, res) => {
  const {
    _id,
  } = req.body;

  try {
    const question = await requestQuestions.findById({_id});
    if(!question) {
      return res.status(404).json({
        success:false,
        message: "Please Refresh the page",
      })
    }

    await allQuestions.create({question});

    if (deleteQuestion(_id)) {
      return res.status(200).json({
        success: true,
        message: "Success in adding Question",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Error in question deletion",
      });
    }
  } catch (e) {
    // console.log("error in adding questions ", e);
    return res.status(402).json({
      success: false,
      message: "error in adding questions",
    });
  }
};

exports.rejectQuestion = async (req, res) => {
  try {
    const { _id } = req.body;
    if (deleteQuestion(_id)) {
      return res.status(200).json({
        success: true,
        message: "Success in rejection of Question",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Error in question rejection",
      });
    }
  } catch (e) {
    // console.log("error in rejection of questions ", e);
    return res.status(402).json({
      success: false,
      message: "error in  rejection question",
    });
  }
};

async function deleteQuestion(_id) {
  try {
    await requestQuestions.deleteOne({ _id });
    return true;
  } catch (e) {
    return false;
  }
}

exports.adminQuestion = async(req,res,)=>{
  try{
    console.log('i am admin to add question')
    const {author,title,description,sample,constraints,main,sampleAnswer,mainAnswer,difficulty,tags} = req.body;
    console.log(req.body);
    await allQuestions.create({author,title,constraints,description,sample,main,sampleAnswer,difficulty,tags,mainAnswer});
    return res.status(200).json({
      success: true,
      message: "this question have added successfully",
    })
  }catch(e){
    // console.log(e);
    return res.status(500).json({
      success:false,
      message:"error in adding question",
    });
  }
}