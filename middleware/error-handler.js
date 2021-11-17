const {StatusCodes} = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
  //debug testing
  // return res.json({err})

  // EVERY error that happens on your server will come through this file
  //we are going to create a custom error so that we can deal with anything

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.msg || 'something went wrong please try again later'
  };

  // This is used to catch validation errors typically catches required & enum
  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = 400;
  }

  if(err.code && err.code === 11000){
    customError.msg = `${Object.values(err.keyValue)} is already taken. Please provide a different ${Object.keys(err.keyValue)}`
    customError.statusCode = 400;
  }
  
  //deals with type casting errors
  if(err.name === "CastError"){
    customError.msg = `No item found with id ${err.value._id}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({msg: customError.msg});
};

module.exports = errorHandler;