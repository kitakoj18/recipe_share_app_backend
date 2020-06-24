const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

exports.signup = (req, res, next) =>{

    // get any validation errors that were collected in validation process in routes auth.js
    const errors = validationResult(req);
    console.log(errors.array());
    if(!errors.isEmpty()){
        // const errorMsg = errors.msg
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const pw = req.body.password;
    const userName = req.body.userName;

    // check to see if user with email already exists
    User.findOne({email: email})
        .then(user =>{
            if(user){
                const error = new Error('A user with this email already exists');
                error.statusCode = 409;
                throw error;
            }
            return User.findOne({userName: userName})
            
        })
        .then(user =>{
            if(user){
                const error = new Error('This username is already taken');
                error.statusCode = 409;
                throw error;
            }
            // encrypt user password
            // salt i.e. number of times to encrypt - standard is 12
            return bcrypt.hash(pw, 12)
        })
        // need to add if userName already exists
        .then(hashedPw =>{
            const user = new User({
                name: name,
                email: email,
                password: hashedPw,
                userName: userName
            })
            return user.save()
        })
        .then(result =>{
            res.status(201).json({message: 'User successfully created', userId: result._id});
        })
        .catch(err =>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}