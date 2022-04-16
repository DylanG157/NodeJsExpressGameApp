import express from "express";
import axios from "axios";
import { validationModel } from "../models/user-model.js";
import { parseString } from "xml2js";
import {
  checkValidation,
  sendError,
} from "../middleware/validation-handler.js";
import {
  fetchUsersBalance,
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

    let response = await fetchUsersBalance(req.query.msisdn);
    let maxLoopValue = 0;
    //Attempt to get the balance, max of 5 attempts, increase if needed
    while (response.status !== 200 && maxLoopValue < 5) {
      maxLoopValue++;
      response = await fetchUsersBalance(req.query.msisdn);
    }
    let usersBalanceAmmount = 0;
    parseString(response.data, (parseError, result) => {
      if (parseError) {
        usersBalanceAmmount = 0;
      } else {
        try {
          usersBalanceAmmount =
            result.BalanceRespone.Balance[0].LineItems[0].LineItem[0]
              .BalanceElement[0].BalanceSpecifications[0].Specification[0]
              .balance;
        } catch (error) {
          usersBalanceAmmount = 0;
        }
      }
    });

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
                .send(
                  setupUserPlaySuccessfullResponse(
                    result,
                    req,
                    response,
                    usersBalanceAmmount
                  )
                );
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
