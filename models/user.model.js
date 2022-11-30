var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    groupId: {
        type: String,
        required: true,
    },
    isSubscribe: {
        type: Boolean,
        default: false,
    },
    chatDate:{
        type:Date,   
    }
    
}, { timestamps: true });

var userData = mongoose.model('user', userSchema);
module.exports = {
    userData: userData,
};
