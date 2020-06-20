const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    recipeTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prepTime: {
        type: Number,
        required: true
    },
    cookTime: {
        type: Number,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    chef: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema)