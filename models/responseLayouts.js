const userBalanceResponseLayout = {
  msisdn: "",
  balance: "",
  response: {
    status: 0,
    message: "",
  },
};

const userBalanceErrorResponseLayout = {
  response: {
    status: "",
    message: "",
  },
};

const userPlayRequestResponseLayout = {
  msisdn: "",
  balance: 0,
  won: "",
  description: "",
  response: {
    status: 0,
    message: "",
  },
};

let usersProfileRequestResponseLayout = {
  wallet: [],
  response: {
    status: 0,
    message: "",
  },
};

export {
  userBalanceResponseLayout,
  userBalanceErrorResponseLayout,
  userPlayRequestResponseLayout,
  usersProfileRequestResponseLayout,
};
