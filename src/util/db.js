"use strict"

let 
    mongoose = require('mongoose'),
    conf = require('../conf');

const favSong = new mongoose.Schema({
    userid: { type: Number, required: true },
    songid: { type: Number, required: true }
});

exports.mongoDB = async() => {
    mongoose.connect(conf.db_url, conf.db_options)
        .then(() => console.log("MongoDB Connected!"))
        .catch((e) => console.log("MongoDB Error:", e));
}
exports.songs = mongoose.model("favsongs", favSong);