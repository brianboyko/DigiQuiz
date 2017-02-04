// ==========================
// ./reducers/index.js
// ==========================

import { combineReducers } from 'redux';
import counter from './counter';
import { routerReducer } from 'react-router-redux';

const appReducer = combineReducers(Object.assign({}, {routing: routerReducer}, {counter}));

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
