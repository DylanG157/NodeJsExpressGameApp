import express from "express";
import axios from "axios";
import { parseString } from "xml2js";
// #Add-Route : Change to name of new route EG: const languageRouter = express.Router();
const userRoute = express.Router();

async function getUsersBalance(req, res, next) {
  let xmlData = ` <?xml version="1.0" encoding="ISO-8859-1"?> <BalanceRequest> <Balance> <LineItems>\ 
  <LineItem> <BalanceElement> <CustomerProduct actionCode="BALANCE"> <Ids> <accountId schemeAgencyName="ACME">R</accountId> 
  </Ids> <cmn:Name>AN</cmn:Name> </CustomerProduct> <Specifications> <Specification> <msisdn>${req.query.msisdn}</msisdn> </Specification>
  </Specifications> </BalanceElement> </LineItem> </LineItems> </Balance> </BalanceRequest>`;

  console.log(xmlData);
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
          let usersBalanceAmmount =
            result.BalanceRespone.Balance[0].LineItems[0].LineItem[0]
              .BalanceElement[0].BalanceSpecifications[0].Specification[0]
              .balance;
          res.send({ clientsBalance: `${usersBalanceAmmount}` });
        }
      });
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
    });
}

userRoute.get("/balance", getUsersBalance);

export default userRoute;
