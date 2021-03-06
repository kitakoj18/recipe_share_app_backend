// middleware to pass through routes that need protection from users who are not signed in
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) =>{

    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('User is not logged in');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, jwtSecret);
    }
    catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('User is not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}