import {
  INCREMENT,
  DOUBLE,
  CLEAR,
  HYDRATE
} from '../constants/index';

const counter = (state = 0, action = {}) => {
  switch (action.type) {
    case INCREMENT:
      return state + parseInt(action.value);
    case DOUBLE:
      return state * 2;
    case CLEAR:
      return 0;
    case HYDRATE:
      return action.hasOwnProperty('counter') ? action.counter : state;
    default:
      return state;
  }
}

export default counter;
