//imports
const mongoose = require('mongoose');

//org schema
const organizationSchema = new mongoose.Schema({
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
    required: true,
    select: false
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
    default: 'admin',
    required: true
  },
  mode: {
    type: String,
    default: 'offline',
    required: true
  },
},
{ timestamps: true }
);

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
