const express = require("express");
const router = express.Router();
const { auth } = require("../middleWare/auth");
const { getOutput, submitCode,getAllSubmissions,getAllDiscussions,postDiscussion,deleteDiscussion } = require("../controller/getOutput");

router.post("/run-code", auth, getOutput);
router.post("/submit-code", auth, submitCode);
router.post("/getAllSubmissions",auth,getAllSubmissions);
router.get('/getAllDiscussions/:qid',getAllDiscussions)
router.post('/postDiscussion',auth,postDiscussion);
router.post('/deleteDiscussion',auth,deleteDiscussion);
module.exports = router;
