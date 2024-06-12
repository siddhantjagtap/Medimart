const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  addressId: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  fullName: String,
  contactNo: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  addressType: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
  otherAddressName: String 
}, { _id: false });

const userSchema = new Schema({
  customerId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Invalid email format',
    },
  },
  password: { type: String, required: true, minlength: 7 },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationOtp: { type: String },
  emailVerificationOtpExpires: { type: Date },
  fullName: String,
  contactNumber: String,
  deliveryAddress: String,
  profilePic: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: (value) => value instanceof Date && !isNaN(value.valueOf()),
      message: 'Invalid date format',
    },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: String },
  addresses: [addressSchema],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
