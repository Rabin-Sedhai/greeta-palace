const mongoose = require("mongoose");

const dbconn = mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true})
    .then(console.log("database connection sucess!!"));


module.exports  = dbconn;