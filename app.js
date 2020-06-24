const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const multer = require('multer');

const dotenv = require('dotenv').config();
const mongoPW = process.env.MONGO_PW;

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'images');
    },
    filename: (req, file, cb) =>{
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

app.use(bodyParser.json()); 

app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) =>{
    User.findById('5ee95722063cd38e55f47f93')
    .then(user =>{
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

app.use('/posts', postsRoutes);

app.use('/auth', authRoutes);

app.use((error, req, res, next) =>{
    const status = error.statusCode || 500;
    const errorMsg = error.message;
    res.status(status).json({message: errorMsg})
})

mongoose.connect(
    'mongodb+srv://kojikit:' + mongoPW + '@cluster0-sz1ci.mongodb.net/recipe_posts?retryWrites=true&w=majority'
).then(result=>{

    User.findOne()
        .then(user =>{
            if(!user){
                const user = new User({
                    name: 'Koji',
                    email: 'koji@gmail.com',
                    password: 'pw',
                    userName: 'kitakoj',
                    posts: []
                })

                user.save();
            }
        })

    app.listen(8080);
})
.catch(err => console.log(err))