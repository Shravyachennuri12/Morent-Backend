const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { 
    type: String, 
    unique: true, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\+\d{1,3}\d{6,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: { type: String, required: true, select: false },
  otp: { type: String },
  otpExpiry: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000) },
  createdAt: { type: Date, default: Date.now },
});

// Virtuals for accessing country code and local number
userSchema.virtual('countryCode').get(function() {
  return this.phoneNumber?.substring(0, 3); // Returns "+91" from "+919876543210"
});

userSchema.virtual('localNumber').get(function() {
  return this.phoneNumber?.substring(3); // Returns "9876543210" from "+919876543210"
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
<<<<<<< HEAD
module.exports = User;
=======
module.exports = User;
>>>>>>> f652a3c (new)
