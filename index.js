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
require('./config/dataBase').dbConnect();
const admin = require('./routers/adminRouter');
const user = require('./routers/userRouter');
app.use('/anurag/v1',user);
app.use('/admin',admin);
app.use('/anurag/v1/questions',require('./routers/questionRouter'));
// app listing
// port 
const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>{
    console.log('listening on port',PORT);
})

app.get('/',(req, res)=>{
    res.send('<h1>Anurag SIngh</h1>');
})

