function setupXmlInputData(req, xmlDataChoice) {
  let xmlDataInput = "";

  if (xmlDataChoice === "getUsersBalance") {
    xmlDataInput = ` <?xml version="1.0" encoding="ISO-8859-1"?> <BalanceRequest> <Balance> <LineItems>\ 
    <LineItem> <BalanceElement> <CustomerProduct actionCode="BALANCE"> <Ids> <accountId schemeAgencyName="ACME">${req.query.UUID}</accountId> 
    </Ids> <cmn:Name>${req.query.userName}</cmn:Name> </CustomerProduct> <Specifications> <Specification> <msisdn>${req.query.msisdn}</msisdn> </Specification>
    </Specifications> </BalanceElement> </LineItem> </LineItems> </Balance> </BalanceRequest>`;
  } else if (xmlDataChoice === "triggerUserPlayRequest") {
    xmlDataInput = `<?xml version="1.0" encoding="ISO-8859-1"?><PlayRequest><Play><LineItems><LineItem>
    <PlayElement><CustomerProduct actionCode="PLAY"><Ids><accountId schemeAgencyName="ACME">${req.query.UUID}</accountId>
    </Ids><name>${req.query.userName}</name></CustomerProduct><Specifications><Specification><msisdn>${req.query.msisdn}</msisdn>
    </Specification></Specifications></PlayElement></LineItem></LineItems></Play></PlayRequest>`;
  } else if (xmlDataChoice === "getUsersProfile") {
    xmlDataInput = `<?xml version="1.0" encoding="ISO-8859-1"?><WalletRequest><Wallet><LineItems><LineItem>
    <WalletElement><CustomerProduct actionCode="Wallet"><Ids><accountId schemeAgencyName="ACME">${req.query.UUID}</accountId>
    </Ids><cmn:Name>${req.query.userName}</cmn:Name></CustomerProduct><Specifications><Specification><msisdn>${req.query.msisdn}</msisdn>
    </Specification></Specifications></WalletElement></LineItem></LineItems></Wallet></WalletRequest>`;
  }

  return xmlDataInput;
}
export { setupXmlInputData };
