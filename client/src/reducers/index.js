import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import coinReducer from './coinReducer'
import simReucer from './simReducers';
import userReducer from './userReducer'

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  coin: coinReducer,
  user: userReducer,
  sim: simReucer
});