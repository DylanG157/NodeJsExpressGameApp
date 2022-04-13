import express from "express";
import axios from "axios";
import { parseString } from "xml2js";
// #Add-Route : Change to name of new route EG: const languageRouter = express.Router();
const userRoute = express.Router();

async function getUsersBalance(req, res, next) {
  axios
    .post(
      `${process.env.ACME_SESSION_URL}/v1/balance`,
      {
        withCredentials: true,
        headers: {
          Accept: "application/xml",
          "Content-Type": "application/xml",
        },
      },
      {
        auth: {
          username: `${process.env.ACME_USERNAME}`,
          password: `${process.env.ACME_PASSWORD}`,
        },
      }
    )
    .then(function (response) {
      console.log("test");
    })
    .catch(function (errorResponse) {
      let xmlData = errorResponse.response.data;
      parseString(xmlData, (parseError, result) => {
        if (parseError) {
          res.send({ errorMessage: `${errorResponse.response.data}` });
        } else {
          let errorMessage =
            result.ErrorResponse.Error[0].LineItems[0].LineItem[0]
              .ErrorElement[0].Error[0].message;
          res.send({ errorMessage: `${errorMessage}` });
        }
      });
      // console.log(errorResponse.response.data);
      res.send({ errorMessage: `${errorResponse.response.data}` });
    });
}

userRoute.get(
  "/balance",

  // #Add-Route : Change to your new service name eg getLanguagePreference
  // EG : getLanguagePreference
  getUsersBalance
);

// eslint-disable-next-line import/prefer-default-export
// #Add-Route : Change to your new DOMAIN name eg languageRouter
// EG : languageRouter
export default userRoute;
