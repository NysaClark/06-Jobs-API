const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name must be provided"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "provide an email"],
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "must provide a valid email",
    ],
    minlength: 3,
    maxlength: 50,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "provide a password"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

UserSchema.methods.comparePassword = async function (submitPass) {
  const isMatch = await bcrypt.compare(submitPass, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
