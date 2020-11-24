var mongoose = require('mongoose')


var hoteSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

var hoteModel = mongoose.model('Hotes', hoteSchema)

module.exports = hoteModel;