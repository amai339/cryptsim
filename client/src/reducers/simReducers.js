import {
  EDIT_MONEY,
  GET_MONEY,
  GET_SIM_WALLET,
  BUY,
  SELL,
  GET_TRANSACTIONS,
  DESTROY,
  GET_MONEY_INVESTED,
} from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case DESTROY: {
      state = undefined;
      return { state };
    }
    case EDIT_MONEY:
      return { ...state, amount: action.payload };
    case GET_MONEY:
      return { ...state, amount: action.payload };
    case BUY:
      return { ...state, amount: action.payload };
    case SELL:
      return { ...state, amount: action.payload };
    case GET_SIM_WALLET:
      return { ...state, sim_wallet: action.payload };
    case GET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case GET_MONEY_INVESTED:
      return { ...state, moneyInvested: action.payload };
    default:
      return state;
  }
}
