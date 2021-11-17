const BadRequest = require("./bad-request");
const CustomAPIError = require("./custom-error");
const UnauthError = require("./unauth");
const NotFoundError = require("./not-found");

module.exports = {
  CustomAPIError,
  BadRequest,
  UnauthError,
  NotFoundError,
};
