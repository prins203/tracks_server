const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).send({ error: 'You must be logged in.'});
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'Secret_Key', async (err, payload) => {   //jwt.verify(<token>,<key>,<decoded-information>)
        if(err){
            return res.status(401).send({ error: 'You must be logged in.'});
        }

        const {userId} = payload;   // using the decode-info (i.e. userID)

        const user = await User.findById(userId);   // finding the user by userID in mongoDB

        req.user = user;    // attaching the user to the request and pass it on the app

        next();     //passing the info to the app
    })
}
