const requestQuestions = require('../model/requestQuestions');

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