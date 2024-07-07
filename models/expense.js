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

module.exports = mongoose.model("expense", expenseSchema);