const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 400;
  err.status = err.status || "Error";

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.status = "unAuthorized";
    err.message = "Sorry, your token has expired";
  }

  if (err.name === "ValidationError") {
    err.statusCode = 401;
    err.status = "Error";
    err.message = "";

    Object.keys(err.errors).forEach((key) => {
      const value = err.errors[key];
      console.log(err.errors);

      err.message += value.message + ", ";
    });

    err.message = err.message.split(",").slice(0, -1).join(",");
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    err.status = "Duplicate Error";

    err.message = "";

    Object.keys(err.keyValue).forEach((key) => {
      err.message += key + ", ";
    });

    err.message = err.message.split(",").slice(0, -1).join(",");

    err.message = err.message + " - this should be Unique. Try Different....";
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 404;
    err.status = "Forbidden";
    err.message =
      "Please check your token carefully. This token is unAuthorized.";
  }

  if (err.message.includes("ETIMEDOUT")) {
    err.statusCode = 404;
    err.status = "Connection Error";
    err.message = "Please check your connection. This is a network issues.";
  }

  if (err.name === "AxiosError") {
    err.statusCode = 404;
    err.status = "Axios Error";
    err.message = "Please check your URL or you API key or Bearer Token.";
  }

  const errorResponse = {
    status: err.status,
    message: err.message, // Include the message property
    error: err,
  };

  res.status(err.statusCode).json(errorResponse);
};

export default globalErrorHandler;
