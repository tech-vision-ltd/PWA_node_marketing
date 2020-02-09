const dynamoose = require('dynamoose');

const AdminSchema = new dynamoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    id: {hashKey: true, type: String, required:true},
    userId: {type: String, required: true},
    password: {type: String, required: true},
}, {timestamps: true});

const Admin = dynamoose.model("Admin", AdminSchema);

module.exports = Admin;
