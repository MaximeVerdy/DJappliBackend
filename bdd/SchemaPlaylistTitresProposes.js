var mongoose = require('mongoose')

var playlistSchema = mongoose.Schema({
    titre: String, //artist-titre
    votes: Array,
    user: String,
})

var playlistModel = mongoose.model('PlaylisTitresProposes', playlistSchema);

module.exports = playlistModel;