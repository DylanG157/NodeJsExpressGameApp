import logger from "./logger.js";

function createErrorObject(error, req) {
  const errorObj = {
    message: error.message
      ? error.message
      : "No error message object available",
    headers: req.headers,
    query: req.query,
    body: req.body,
    stack: error.stack ? error.stack : "No stack object available",
  };
  return errorObj;
}
function errorLogger(error, req, res, next) {
  const errorObj = createErrorObject(error, req);
  logger.error(JSON.stringify(errorObj)); // or using any fancy logging library
  next(error); // forward to next middleware
}

function errorResponder(error, req, res, next) {
  // responding to client
  if (error.type === "redirect") res.redirect("/error");
  else if (error.type === "time-out")
    // arbitrary condition check
    res.status(408).send(error);
  else next(error); // forwarding exceptional case to fail-safe middleware
}

function failSafeHandler(error, req, res, next) {
  // generic handler
  const errorObj = createErrorObject(error, req);
  res.status(500).send(errorObj);
}

export { errorLogger, errorResponder, failSafeHandler };
