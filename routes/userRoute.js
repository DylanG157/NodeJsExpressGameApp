import express from "express";
import axios from "axios";
import { parseString } from "xml2js";
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
        } else {
          try {
            res
              .status(200)
              .send(setupUserBalanceSuccessfullResponse(result, req, response));
          } catch (error) {
            res.status(400).send(setupLocalErrorUserBalanceResponse(error));
          }
        }
      });
    })
    .catch(function (errorResponse) {
      let xmlData = errorResponse.response.data;
      parseString(xmlData, (parseError, result) => {
        if (parseError) {
          res.status(400).send(setupParseErrorResponse(errorResponse));
        } else {
          res.status(400).send(setupUserErrorResponse(result, errorResponse));
        }
      });
    });
}

async function triggerUserPlayRequest(req, res, next) {
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
        } else {
          try {
            res
              .status(200)
              .send(setupUserPlaySuccessfullResponse(result, req, response));
          } catch (error) {
            res.status(400).send(setupLocalErrorUserPlayTriggerResponse(error));
          }
        }
      });
    })
    .catch(function (errorResponse) {
      let xmlData = errorResponse.response.data;
      parseString(xmlData, (parseError, result) => {
        if (parseError) {
          res.status(400).send(setupParseErrorResponse(errorResponse));
        } else {
          res.status(400).send(setupUserErrorResponse(result, errorResponse));
        }
      });
    });
}

async function getUsersProfile(req, res, next) {
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
        } else {
          try {
            res
              .status(200)
              .send(setupUserProfileSuccessfullResponse(result, req, response));
          } catch (error) {
            res.status(400).send(setupLocalErrorUserBalanceResponse(error));
          }
        }
      });
    })
    .catch(function (errorResponse) {
      let xmlData = errorResponse.response.data;
      parseString(xmlData, (parseError, result) => {
        if (parseError) {
          res.status(400).send(setupParseErrorResponse(errorResponse));
        } else {
          res.status(400).send(setupUserErrorResponse(result, errorResponse));
        }
      });
    });
}

userRoute.get("/balance", authenticateToken, getUsersBalance);
userRoute.get("/play", authenticateToken, triggerUserPlayRequest);
userRoute.get("/profile", authenticateToken, getUsersProfile);

export default userRoute;
