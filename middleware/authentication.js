const jwt = require("jsonwebtoken");
const { UnauthError } = require("../errors");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthError("not authorized to be here");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userID: payload.userID, name: payload.name };
    next();
  } catch (err) {
    throw new UnauthError("Authorization Invalid");
  }
};

module.exports = authenticateUser;
