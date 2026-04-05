const mongoose = require("mongoose");

//role enum
const roleEnum = ['superadmin','admin','faculty', 'staff' ,'student'];



//user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    orgId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    orgName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: roleEnum,
        default: 'student'
    },

}, { timestamps: true });

const user = mongoose.model('Users', userSchema);

module.exports = user;
