const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    userId: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    type: {type: String, required: true},
    password: {type: String, required: true},
    repassword: {type: String, required: true}
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

module.exports = User;
