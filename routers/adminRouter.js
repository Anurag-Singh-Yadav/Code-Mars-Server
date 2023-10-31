const express = require('express');
const router = express.Router();

const {pushQuestion,rejectQuestion} = require('../controller/addRemoveQuestions');
const {loginAdmin,addAdmin} = require('../controller/adminAuth');
const {adminQuestion} = require('../controller/addRemoveQuestions');

router.post('/pushQuestion',pushQuestion);
router.post('/addAdmin',addAdmin);
router.post('/loginAdmin',loginAdmin);
router.post('/rejectQuestion',rejectQuestion);

router.post('/pushDirect',adminQuestion);

module.exports = router;