const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
// const bcrypt = require("bcrypt");
const BadRequestError = require('../errors');

const register = async (req, res) => {
  //hashing - passing a string through a formula to get back a completely diffeent string. Hashes are 1 way
  //salting - create a random number of bits and add it to the string before hashing (10 bits is 1024x more complex)
  //peppering - adding an extra letter [a-zA-Z] to the end of the password (52x more complex)

  // const { password } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const hashpass = await bcrypt.hash(password, salt);

  const newUser = await User.create(req.body);
  const token = newUser.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: newUser.name, userID: newUser._id }, token });
};

const login = async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password){
    throw new BadRequestError('must provide an email and password')
  }
  const user = await User.findOne({ email });
  if(!user){
    throw new UnauthError("Invalid Credentials")
  }
  const isPassCorrect = await user.comparePassword(password);
  if(!isPassCorrect){
    throw new UnauthError('Invalid Credentials')
  }

  const token = user.createJWT();

  res.
    status(StatusCodes.OK)
    .json({ user: { name: user.name, userID: user.id}, token })
};

module.exports = { register, login };
