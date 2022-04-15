import express from "express";
import axios from "axios";
import { validationModel } from "../models/user-model.js";
import { parseString } from "xml2js";
import {
  checkValidation,
  sendError,
} from "../middleware/validation-handler.js";
import {
  setupUserBalanceSuccessfullResponse,
  setupLocalErrorUserBalanceResponse,
  setupUserErrorResponse,
  setupParseErrorResponse,
  setupUserPlaySuccessfullResponse,
  setupLocalErrorUserPlayTriggerResponse,
  setupUserProfileSuccessfullResponse,
} from "../utilities/userBalance.js";
import { setupXmlInputData } from "../utilities/setupXmlInputData";
import { authenticateToken } from "../middleware/jwt-authenticate.js";

const userRoute = express.Router();

async function getUsersBalance(req, res, next) {
  const errors = checkValidation(req);
  if (!errors.isEmpty()) {
    sendError(res, errors);
  } else {
    let xmlData = setupXmlInputData(req.query.msisdn, "getUsersBalance");

    axios
      .post(`${process.env.ACME_SESSION_URL}/v1/balance`, xmlData, {
        withCredentials: true,
        headers: {
          Accept: "application/xml",
          "Content-Type": "text/xml",
        },
        auth: {
          username: `${process.env.ACME_USERNAME}`,
          password: `${process.env.ACME_PASSWORD}`,
        },
      })
      .then(function (response) {
        parseString(response.data, (parseError, result) => {
          if (parseError) {
            res.send({ errorMessage: parseError });
            next();
          } else {
            try {
              res
                .status(200)
                .send(
                  setupUserBalanceSuccessfullResponse(result, req, response)
                );
              next();
            } catch (error) {
              res.status(400).send(setupLocalErrorUserBalanceResponse(error));
              next();
            }
          }
        });
      })
      .catch(function (errorResponse) {
        let xmlData = errorResponse.response.data;
        parseString(xmlData, (parseError, result) => {
          if (parseError) {
            res.status(400).send(setupParseErrorResponse(errorResponse));
            next();
          } else {
            res.status(400).send(setupUserErrorResponse(result, errorResponse));
            next();
          }
        });
      });
  }
}

async function triggerUserPlayRequest(req, res, next) {
  const errors = checkValidation(req);
  if (!errors.isEmpty()) {
    sendError(res, errors);
  } else {
    let xmlData = setupXmlInputData(req.query.msisdn, "getUsersBalance");

    axios
      .post(`${process.env.ACME_SESSION_URL}/v1/play`, xmlData, {
        withCredentials: true,
        headers: {
          Accept: "application/xml",
          "Content-Type": "text/xml",
        },
        auth: {
          username: `${process.env.ACME_USERNAME}`,
          password: `${process.env.ACME_PASSWORD}`,
        },
      })
      .then(function (response) {
        parseString(response.data, (parseError, result) => {
          if (parseError) {
            res.send({ errorMessage: parseError });
            next();
          } else {
            try {
              res
                .status(200)
                .send(setupUserPlaySuccessfullResponse(result, req, response));
              next();
            } catch (error) {
              res
                .status(400)
                .send(setupLocalErrorUserPlayTriggerResponse(error));
              next();
            }
          }
        });
      })
      .catch(function (errorResponse) {
        let xmlData = errorResponse.response.data;
        parseString(xmlData, (parseError, result) => {
          if (parseError) {
            res.status(400).send(setupParseErrorResponse(errorResponse));
            next();
          } else {
            res.status(400).send(setupUserErrorResponse(result, errorResponse));
            next();
          }
        });
      });
  }
}

async function getUsersProfile(req, res, next) {
  const errors = checkValidation(req);
  if (!errors.isEmpty()) {
    sendError(res, errors);
  } else {
    let xmlData = setupXmlInputData(req.query.msisdn, "getUsersProfile");

    axios
      .post(`${process.env.ACME_SESSION_URL}/v1/wallet`, xmlData, {
        withCredentials: true,
        headers: {
          Accept: "application/xml",
          "Content-Type": "text/xml",
        },
        auth: {
          username: `${process.env.ACME_USERNAME}`,
          password: `${process.env.ACME_PASSWORD}`,
        },
      })
      .then(function (response) {
        parseString(response.data, (parseError, result) => {
          if (parseError) {
            res.send({ errorMessage: parseError });
            next();
          } else {
            try {
              res
                .status(200)
                .send(
                  setupUserProfileSuccessfullResponse(result, req, response)
                );
              next();
            } catch (error) {
              res.status(400).send(setupLocalErrorUserBalanceResponse(error));
              next();
            }
          }
        });
      })
      .catch(function (errorResponse) {
        let xmlData = errorResponse.response.data;
        parseString(xmlData, (parseError, result) => {
          if (parseError) {
            res.status(400).send(setupParseErrorResponse(errorResponse));
            next();
          } else {
            res.status(400).send(setupUserErrorResponse(result, errorResponse));
            next();
          }
        });
      });
  }
}

userRoute.get(
  "/balance",
  authenticateToken,
  validationModel("getUsersBalance"),
  getUsersBalance
);
userRoute.get(
  "/play",
  authenticateToken,
  validationModel("triggerUserPlayRequest"),
  triggerUserPlayRequest
);
userRoute.get(
  "/profile",
  authenticateToken,
  validationModel("getUsersProfile"),
  getUsersProfile
);

export default userRoute;
