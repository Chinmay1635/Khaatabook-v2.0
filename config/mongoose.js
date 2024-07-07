const mongoose = require('mongoose');
const debugLog = require('debug')('development:mongooseconfig');
mongoose.connect("mongodb://127.0.0.1:27017/khatabook");

const db = mongoose.connection;

db.on("error", function(err){
    debugLog(err);
})

db.on("open", function(){
    debugLog("connected to database...");
});

module.exports = db;
