const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
// middle ware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// db connection
const BASE_URL = process.env.BASE_URL;
const admin_base = process.env.ADMIN_BASE
const QUESTION_URL = process.env.QUESTION_URL;
require('./config/dataBase').dbConnect();
const admin = require('./routers/adminRouter');
const user = require('./routers/userRouter');
app.use(BASE_URL,user);
app.use(admin_base,admin);
app.use(QUESTION_URL,require('./routers/questionRouter'));
// app listing
// port 
const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>{
    console.log('listening on port',PORT);
})

app.get('/',(req, res)=>{
    res.send('<h1>Anurag SIngh</h1>');
})

