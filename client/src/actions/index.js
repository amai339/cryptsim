import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  GET_COIN_DATA,
  GET_COINS_DATA,
  GET_ALL_COINS,
  GET_WATCHLIST,
  UPDATE_WATCHLIST,
  GET_MONEY,
  EDIT_MONEY,
  GET_SIM_WALLET,
  BUY,
  SELL,
  GET_TRANSACTIONS,
  DESTROY,
  GET_MONEY_INVESTED
} from "./types";

export const registerUser = (userData, history) => async (dispatch) => {
  try {
    await axios.post("/user/register", userData);
    history.push("/login");
  } catch (err) {
    dispatch({ type: GET_ERRORS, payload: err.response.data });
  }
};

export const loginUser = (userData) => async (dispatch) => {
  try {
    const res = await axios.post("/user/login", userData);
    const { token } = res.data;
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    dispatch(setCurrentUser(decoded));
  } catch (err) {
    dispatch({ type: GET_ERRORS, payload: err.response.data });
  }
};

export const setCurrentUser = (decoded) => {
  return { type: SET_CURRENT_USER, payload: decoded };
};

export const setUserLoading = () => {
  return { type: USER_LOADING };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch({type:DESTROY, payload: {}});
};

export const getcoinData = (symbol) => async (dispatch) => {
  const res = await axios.get(`/coin/${symbol}`);
  dispatch({ type: GET_COIN_DATA, payload: res.data });
};

export const getCoinsData = (coin_list) => async (dispatch) => {
  const res = await axios.post("/coin/list", coin_list);
  dispatch({ type: GET_COINS_DATA, payload: res.data });
};

export const getAllCoins = () => async (dispatch) => {
  await axios.patch('/coin/latest');
  const res = await axios.get("/coin/all");
  dispatch({ type: GET_ALL_COINS, payload: res.data });
};

export const getWatchlist = (id) => async (dispatch) => {
  const res = await axios.get("/user/watchlist", { params: { id } });
  dispatch({ type: GET_WATCHLIST, payload: res.data });
};

export const updateWatchlist = (watchlist, id) => async (dispatch) => {
  const symbols = watchlist.map((coin) => coin.symbol);
  await axios.patch("/user/watchlist", { symbols, id });
  dispatch({ type: UPDATE_WATCHLIST, payload: {} });
};

export const buyCoin = (id, coin, volume, price) => async (dispatch) => {
  price = price.toFixed(2);
  const res = await axios.patch("/sim/buy", { id, coin, volume, price });
  dispatch({ type: BUY, payload: res.data });
};

export const sellCoin = (id, coin, volume, price) => async (dispatch) => {
  price = price.toFixed(2);
  const res = await axios.patch("/sim/sell", { id, coin, volume, price });
  dispatch({ type: SELL, payload: res.data });
};
export const editMoney = (id, amount) => async (dispatch) => {
  const res = await axios.patch("/sim/money", { id, amount });
  dispatch({ type: EDIT_MONEY, payload: res.data });
};

export const getMoney = (id) => async (dispatch) => {
  const res = await axios.get("/sim/money", { params: { id } });
  dispatch({ type: GET_MONEY, payload: res.data });
};

export const getSimWallet = (id) => async (dispatch) => {
  const res = await axios.get("/sim/wallet", { params: { id } });
  dispatch({ type: GET_SIM_WALLET, payload: res.data });
};

export const getTransactions = (id) => async (dispatch) => {
  const res = await axios.get("/sim/history", { params: { id } });
  dispatch({ type: GET_TRANSACTIONS, payload: res.data });
};

export const getMoneyInvested = (id) => async dispatch => {
  const res = await axios.get('/sim/totalinvested', {params: {id}});
  dispatch({type: GET_MONEY_INVESTED, payload:res.data})
}