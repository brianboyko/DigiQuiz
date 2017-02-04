import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store, {routeTo} from './store/configureStore';
import App from './components/App';
import Hero from './components/Hero';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, push} from 'react-router-redux';

const history = syncHistoryWithStore(browserHistory, store);
const MOUNT_NODE = document.getElementById('root');

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider routeTo={routeTo} store={store}>
          <Router history={history}>
            <Route path="/" component={App}>
              <IndexRoute component={Hero}/>
              <Route path="home" component={Hero}/>
            </Route>
          </Router>
      </Provider>
    );
  }
}


ReactDOM.render(<Root store={store} />, MOUNT_NODE);
