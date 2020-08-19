import { GET_COIN_DATA, GET_COINS_DATA, GET_ALL_COINS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COIN_DATA:
      return action.payload[0]
    case GET_COINS_DATA:
      return {...state, default_data: action.payload}
    case GET_ALL_COINS:
      return {...state, coin_data: action.payload}
    
    default:
      return state;
  }
}