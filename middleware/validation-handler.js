import { validationResult } from "express-validator";

function checkValidation(req) {
  const errors = validationResult(req);
  return errors;
}
function sendError(res, errors) {
  res.status(422).jsonp(errors.array());
}

export { checkValidation, sendError };
