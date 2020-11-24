// modèle pour chansons proposées automatiquement au DJ hôte

var mongoose = require('mongoose')


var topSchema = mongoose.Schema({
    chanson: String,
})

var topModel = mongoose.model('topchansons', topSchema)


module.exports = topModel;
