import { GET_WATCHLIST,UPDATE_WATCHLIST } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_WATCHLIST:
      return {...state, watchlist: action.payload}
    case UPDATE_WATCHLIST:
      return {...state}
    default:
      return state;
  }
}