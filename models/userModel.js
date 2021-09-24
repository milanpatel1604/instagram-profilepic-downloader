const crypto = require("crypto");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");
const ObjectId=Schema.ObjectId;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "Email already exist"],
    validate: [validator.isEmail, "Please provide a valid Email"],
  },
  login_using: {
    type: String,
    enum: ["email", "google", "facebook"],
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ["user", "prime-user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  meditationFavorite_id:{
    type: [ObjectId],
  },
  sleepFavorite_id: {
    type: [ObjectId]
  },
  relaxFavorite_id: {
    type: [ObjectId]
  },
  passwordChangedAt: {
    type: Date,
  },
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createVerificationToken = function () {
  const token = Math.floor(100000+Math.random()*900000);

  this.verificationToken = token

  console.log({ token }, this.verificationToken);

  this.verificationTokenExpiresAt = Date.now() + 2 * 60 * 1000;

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
