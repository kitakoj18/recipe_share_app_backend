const fs = require('fs');
const path = require('path');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPost = (req, res, next) =>{

    const postId = req.params.postId

    Post.findById(postId)
        .populate('chef', 'name')
        .then(post =>{
            if(!post){
                const error = new Error('Could not get post');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({message: 'Post retrieved', post: post})

        })
        .catch(err=>{
            console.log(err)
            // if(!err.statusCode){
            //     err.statusCode = 500
            // }
            // next(err);
        })
}

exports.getPosts = (req, res, next) =>{

    Post.find()
        .populate('chef', 'name')
        .then(posts =>{
            res.json({message: 'All posts retrieved', posts: posts})
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            console.log(err)
        })
}

exports.createPost = (req, res, next) =>{

    console.log(req.file)

    const title = req.body.title;
    const description = req.body.description;
    const prepTime = parseInt(req.body.prepTime);
    const cookTime = parseInt(req.body.cookTime);
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    //userId is assigned in loggedIn.js
    //this is a string but Mongoose will convert to id type itself
    const creator = req.userId;
    const imageUrl = req.file.path;

    // console.log(req.file)

    const post = new Post({
        recipeTitle: title,
        description: description,
        prepTime: prepTime,
        cookTime: cookTime,
        ingredients: ingredients,
        instructions: instructions,
        chef: creator,
        imageUrl: imageUrl
    });

    post.save()
        // add post to user who created it
        .then(result =>{
            return User.findById(req.userId);
        })
        .then(user =>{
            user.posts.push(post);
            return user.save();
        })
        .then(result =>{
            // console.log('Post created successfully')
            res.status(201).json({
                message: 'Post created successfully'
            })
        })
        .catch(err => console.log(err))
}

