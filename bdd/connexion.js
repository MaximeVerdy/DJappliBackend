var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect('mongodb+srv://admin:30094561@cluster0.xutoc.mongodb.net/EveryOneIsTheDJ?retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err)
    })


module.exports = mongoose;
