require('./models/User');   //declare the model only once -- re-declaring will cause an issue
require('./models/Track')
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');

//MongoDB ----------
const mongoURI = 'mongodb+srv://admin:passpass@cluster0.mt6hj.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI);
mongoose.connection.on('connected', ()=> {
    console.log('connected to mongoDB');
})
mongoose.connection.on('error', (error) => {
    console.error('error connecting to mongoDB', error);
})
//------------------

const app = express();

//user requests flows throught the following app.use lines sequencially
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

//this route uses >>requireAuth<< before fwding the req
app.get('/', requireAuth, (req,res) => {       
    res.send(`Hi ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});