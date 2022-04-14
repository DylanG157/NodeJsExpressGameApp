import express from "express";
import axios from "axios";
import { parseString } from "xml2js";
// #Add-Route : Change to name of new route EG: const languageRouter = express.Router();
const userRoute = express.Router();

let userBalanceResponseLayout = {
  msisdn: "",
  balance: "",
  response: {
    status: 0,
    message: "",
  },
};

let userBalanceErrorResponseLaytout = {
  response: {
    status: "",
    message: "",
  },
};

async function getUsersBalance(req, res, next) {
  let xmlData = ` <?xml version="1.0" encoding="ISO-8859-1"?> <BalanceRequest> <Balance> <LineItems>\ 
  <LineItem> <BalanceElement> <CustomerProduct actionCode="BALANCE"> <Ids> <accountId schemeAgencyName="ACME">R</accountId> 
  </Ids> <cmn:Name>AN</cmn:Name> </CustomerProduct> <Specifications> <Specification> <msisdn>${req.query.msisdn}</msisdn> </Specification>
  </Specifications> </BalanceElement> </LineItem> </LineItems> </Balance> </BalanceRequest>`;

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
            let usersBalanceAmmount =
              result.BalanceRespone.Balance[0].LineItems[0].LineItem[0]
                .BalanceElement[0].BalanceSpecifications[0].Specification[0]
                .balance;
            userBalanceResponseLayout.msisdn = req.query.msisdn;
            userBalanceResponseLayout.balance = parseInt(usersBalanceAmmount);
            userBalanceResponseLayout.response.status = response.status;
            userBalanceResponseLayout.response.message = `Balance for user ${req.query.msisdn}`;
            res.status(200).send(userBalanceResponseLayout);
          } catch (error) {
            userBalanceErrorResponseLaytout.response.status = 400;
            userBalanceErrorResponseLaytout.response.message = `${error}`;
            res.status(400).send(userBalanceErrorResponseLaytout);
          }
        }
      });
    })
    .catch(function (errorResponse) {
      let xmlData = errorResponse.response.data;
      parseString(xmlData, (parseError, result) => {
        if (parseError) {
          userBalanceErrorResponseLaytout.response.status =
            errorResponse.response.status;
          userBalanceErrorResponseLaytout.response.message = `${errorResponse.response.data}`;
          res.status(400).send(userBalanceErrorResponseLaytout);
        } else {
          let errorMessage =
            result.ErrorResponse.Error[0].LineItems[0].LineItem[0]
              .ErrorElement[0].Error[0].message;
          userBalanceErrorResponseLaytout.response.status =
            errorResponse.response.status;
          userBalanceErrorResponseLaytout.response.message = `${errorMessage}`;
          res.status(400).send(userBalanceErrorResponseLaytout);
        }
      });
    });
}

userRoute.get("/balance", getUsersBalance);

export default userRoute;
