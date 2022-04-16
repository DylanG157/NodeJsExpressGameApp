import axios from "axios";
import { parseString } from "xml2js";
import {
  userBalanceResponseLayout,
  userBalanceErrorResponseLayout,
  userPlayRequestResponseLayout,
  usersProfileRequestResponseLayout,
} from "../models/responseLayouts";

async function fetchUsersBalance(msisdn) {
  let xmlData = ` <?xml version="1.0" encoding="ISO-8859-1"?> <BalanceRequest> <Balance> <LineItems>\ 
    <LineItem> <BalanceElement> <CustomerProduct actionCode="BALANCE"> <Ids> <accountId schemeAgencyName="ACME">R</accountId> 
    </Ids> <cmn:Name>AN</cmn:Name> </CustomerProduct> <Specifications> <Specification> <msisdn>${msisdn}</msisdn> </Specification>
    </Specifications> </BalanceElement> </LineItem> </LineItems> </Balance> </BalanceRequest>`;
  let usersBalanceAmmount = 0;
  try {
    return await axios.post(
      `${process.env.ACME_SESSION_URL}/v1/balance`,
      xmlData,
      {
        withCredentials: true,
        headers: {
          Accept: "application/xml",
          "Content-Type": "text/xml",
        },
        auth: {
          username: `${process.env.ACME_USERNAME}`,
          password: `${process.env.ACME_PASSWORD}`,
        },
      }
    );
  } catch (err) {
    // Handle Error Here
    return usersBalanceAmmount;
  }
}

function setupUserBalanceSuccessfullResponse(result, req, response) {
  let userBalanceResponse = userBalanceResponseLayout;
  let usersBalanceAmmount =
    result.BalanceRespone.Balance[0].LineItems[0].LineItem[0].BalanceElement[0]
      .BalanceSpecifications[0].Specification[0].balance;

  userBalanceResponse.msisdn = req.query.msisdn;
  userBalanceResponse.balance = parseInt(usersBalanceAmmount);
  userBalanceResponse.response.status = response.status;
  userBalanceResponse.response.message = `Balance for user ${req.query.msisdn}`;
  return userBalanceResponse;
}

function setupLocalErrorUserBalanceResponse(error) {
  let userErrorResponse = userBalanceErrorResponseLayout;
  userErrorResponse.response.status = 400;
  userErrorResponse.response.message = `${error}`;
  return userErrorResponse;
}

function setupUserErrorResponse(result, errorResponse) {
  let userErrorResponse = userBalanceErrorResponseLayout;
  let errorMessage =
    result.ErrorResponse.Error[0].LineItems[0].LineItem[0].ErrorElement[0]
      .Error[0].message;
  userErrorResponse.response.status = errorResponse.response.status;
  userErrorResponse.response.message = `${errorMessage}`;
  return userErrorResponse;
}

function setupParseErrorResponse(errorResponse) {
  let userErrorResponse = userBalanceErrorResponseLayout;
  userErrorResponse.response.status = errorResponse.response.status;
  userErrorResponse.response.message = `${errorResponse.response.data}`;
  return userErrorResponse;
}

function setupUserPlaySuccessfullResponse(
  result,
  req,
  response,
  usersBalanceAmmount
) {
  let userPlayRequestResponse = userPlayRequestResponseLayout;
  let rewardMessage = " ";
  //Check if we dealing with an error response
  if (typeof result.ErrorResponse !== "undefined") {
    let errorResultCode =
      result.ErrorResponse.Error[0].LineItems[0].LineItem[0].ErrorElement[0]
        .Error[0].code;
    //Dealin with result code 404 - 'User is out of plays'
    if (errorResultCode == 404) {
      userPlayRequestResponse.balance = `${usersBalanceAmmount}`;
      rewardMessage =
        result.ErrorResponse.Error[0].LineItems[0].LineItem[0].ErrorElement[0]
          .Error[0].message;
      userPlayRequestResponse.won = "false";
      userPlayRequestResponse.response.message = `User ${req.query.msisdn} did not win a price`;
    }
    //Check if we are dealing with a successful response
  } else if (typeof result.PlayRespone !== "undefined") {
    let rewardsCode =
      result.PlayRespone.Play[0].LineItems[0].LineItem[0].PlayElement[0]
        .Specifications[0].Specification[0].result;
    //Dealing with result code 99 - 'Play successful and user did not receive a reward'
    if (rewardsCode == 99) {
      userPlayRequestResponse.balance = `${usersBalanceAmmount}`;
      userPlayRequestResponse.won = "false";
      rewardMessage = "Sorry better luck next time";
      userPlayRequestResponse.response.message = `User ${req.query.msisdn} did not win a price`;
      //Dealing with result code 42 - 'Play successful and user won a reward'
    } else if (rewardsCode == 42) {
      userPlayRequestResponse.balance = `${usersBalanceAmmount}`;
      userPlayRequestResponse.won = "true";
      rewardMessage = `You've won a ${result.PlayRespone.Play[0].LineItems[0].LineItem[0].PlayElement[0].Specifications[0].Specification[0].rewardRef}`;
      userPlayRequestResponse.response.message = `User ${req.query.msisdn} won a price`;
    }
  }
  userPlayRequestResponse.response.status = response.status;
  userPlayRequestResponse.msisdn = `${req.query.msisdn}`;
  userPlayRequestResponse.description = `${rewardMessage}`;
  return userPlayRequestResponse;
}

function setupLocalErrorUserPlayTriggerResponse(error) {
  let userErrorResponse = userBalanceErrorResponseLayout;
  userErrorResponse.response.status = 400;
  userErrorResponse.response.message = `${error}`;
  return userErrorResponse;
}

function setupUserProfileSuccessfullResponse(result, req, response) {
  let userProfileResponse = usersProfileRequestResponseLayout;
  result.WalletRespone.Wallet[0].LineItems[0].LineItem[0].WalletElement[0].WalletSpecifications[0].Items[0].reward.forEach(
    (element) => {
      let walletObject = {
        ref: "",
        description: "",
        awardedAt: "",
      };
      walletObject.ref = element.$.reference;
      walletObject.description = `${element.description}`;
      walletObject.awardedAt = `${element.timestamp}`;
      userProfileResponse.wallet.push(walletObject);
    }
  );
  userProfileResponse.response.status = response.status;
  userProfileResponse.response.message = `Profile for user ${req.query.msisdn}`;
  return userProfileResponse;
}

export {
  fetchUsersBalance,
  setupUserBalanceSuccessfullResponse,
  setupLocalErrorUserBalanceResponse,
  setupUserErrorResponse,
  setupParseErrorResponse,
  setupUserPlaySuccessfullResponse,
  setupLocalErrorUserPlayTriggerResponse,
  setupUserProfileSuccessfullResponse,
};
