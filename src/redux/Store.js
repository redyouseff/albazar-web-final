import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import RootRedux from "./Reducers/RootRedux";
import { composeWithDevTools } from '@redux-devtools/extension';

const initialState = {};
const middleware = [thunk];

const store = createStore(
  RootRedux,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;



