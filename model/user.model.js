const mongoose = require('mongoose')

const userScehama = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    number: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['unverify', 'active', 'block'],
        default: 'unverify'
    },
    gender: {
        type: String,
        require: true
    },
    password:{
        type:String,
        require:true
    },
    city_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"city"
    }
}, { timestamps: true })
const user = mongoose.model('user', userScehama);
module.exports = user

