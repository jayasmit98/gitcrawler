const mongoose = require('mongoose');

const userdet = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

})

const User = mongoose.model("Users", userdet);
module.exports = User;