var mongoose = require('mongoose')


var tourdevoteSchema = mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Events'},
    date: Date,
    isOpen: Boolean,
    echeance: Date,
    participants: Array,
})

var tourdevoteModel = mongoose.model('Tourdevote', tourdevoteSchema);

module.exports = tourdevoteModel;