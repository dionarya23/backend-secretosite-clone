var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    valueMesssage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('message', MessageSchema);