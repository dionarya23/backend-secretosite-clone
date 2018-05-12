var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        index: { 
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', (next) => {
    const users = this;
    if (!users.isModified('password')) return next();
    
    var password   = bcrypt.hashSync(users.password);
    users.password = password;
    next();
});

UserSchema.methods.comparePassword = (cadidatePass, cb) => {
    bcrypt.compare(cadidatePass, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);