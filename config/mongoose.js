const mongoose = require('mongoose');
const debugLog = require('debug')('development:mongooseconfig');
mongoose.connect("mongodb+srv://chinmaykulkarni165:f2EVbqLtf0gRgOqJ@cluster0.ujfttbw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;

db.on("error", function(err){
    debugLog(err);
})

db.on("open", function(){
    debugLog("connected to database...");
});

module.exports = db;
