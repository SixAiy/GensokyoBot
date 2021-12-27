const mongoose = require('mongoose');
const conf = require('./conf');

const sharding = new mongoose.Schema({
    shard_id: { type: Number, required: true },
    shard_name: { type: String }
});
const favSong = new mongoose.Schema({
    user_id: { type: Number, required: true },

});
const autoMusic = new mongoose.Schema({
    guild_id: { type: Number, required: true },
    channel_id: { type: Number },
    enable: { type: Boolean, required: true, default: false }
});

exports.sharding = mongoose.model("sharding", sharding);
exports.favsong = mongoose.model("favsong", favSong);
exports.autoMusic = mongoose.model("automusic", autoMusic);
exports.mongoDB = async(app) => {
    mongoose.connect(conf.db_url)
        .then(() => app.core.log("MongoDB", "Connected!"))
        .catch((e) => app.core.log("Mongo Error", e.stack));
};