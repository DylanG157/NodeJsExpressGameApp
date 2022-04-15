import { check, body } from "express-validator";

function createDefault(name, min, max) {
  return check(name)
    .not()
    .isEmpty()
    .withMessage(`${name} is not present`)
    .isLength({
      min,
      max,
    })
    .withMessage(
      `${name} must have minimum of ${min} character(s) and a maximum of ${max} character(s)`
    );
}

function createDefaultBody(name, min, max) {
  return body(name)
    .not()
    .isEmpty()
    .withMessage(`${name} is not present`)
    .isLength({
      min,
      max,
    })
    .withMessage(
      `${name} must have minimum of ${min} character(s) and a maximum of ${max} character(s)`
    );
}

// eslint-disable-next-line import/prefer-default-export
export { createDefault, createDefaultBody };
