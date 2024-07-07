const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    title:String,
    description:String,
    properties:{
        encrypt:Boolean,
        password:String,
        sharable:Boolean,
        edit:Boolean,
    },
    date:String,
});

const userSchema = mongoose.Schema({
    username : String,
    name : String,
    email : String,
    password : String,
    expense:[expenseSchema]
});

module.exports = mongoose.model("user", userSchema);