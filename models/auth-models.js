import { createDefaultBody } from "./common.js";

const validateAuthUser = [
  createDefaultBody("client_id", 128, 128),
  createDefaultBody("client_secret", 128, 128),
];

function validationModel(key) {
  switch (key) {
    case "userTokenGeneration":
      return validateAuthUser;
    default:
      return true;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { validationModel };
