import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const pick = (state, list) => list.reduce((pv, cv) => {
  pv[cv] = state[cv];
  return pv;
}, {})

const reduxify = (actions, keyList, component, optionalMethods) => {
  const mapStateToProps = (state) => pick(state, keyList);
  const prepareActions = (actions) => (dispatch) => {
    if (actions.hasOwnProperty('default') && Object.keys(actions).length === 1){
      actions = actions.default;
    };
    let output = {
      action: bindActionCreators(actions, dispatch),
      dispatch: dispatch,
    }
    if (optionalMethods && typeof(optionalMethods) === "object") {
      for (var key in optionalMethods) {
        output[key] = optionalMethods[key];
      }
    }
    return output;
  }
  const mapDispatchToProps = (dispatch) => prepareActions(actions, dispatch);
  return connect(mapStateToProps, mapDispatchToProps)(component);
};

export default reduxify;
