const mongoose = require("mongoose");

//role enum
const roleEnum = ['admin','faculty', 'staff' ,'student'];
const modeEnum = ['online', 'offline', 'hybrid'];


//user schema
const orgSchema = new mongoose.Schema({
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
    ownBy: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: roleEnum,
        default: 'user'
    },
    mode: {
        type: String,
        enum: modeEnum,
        default: 'offline',
    }
}, { timestamps: true });

const Organization = mongoose.model('Organization', orgSchema);

module.exports = Organization;
