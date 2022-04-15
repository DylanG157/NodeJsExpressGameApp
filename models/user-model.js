import { createDefault } from "./common.js";

const validateGetUsersBalance = createDefault("msisdn", 10, 10);
const validateGetUsersProfile = createDefault("msisdn", 10, 10);
const validateTriggerUserPlayRequest = createDefault("msisdn", 10, 10);

function validationModel(key) {
  switch (key) {
    case "getUsersBalance":
      return validateGetUsersBalance;
    case "triggerUserPlayRequest":
      return validateTriggerUserPlayRequest;
    case "getUsersProfile":
      return validateGetUsersProfile;
    default:
      return true;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { validationModel };
