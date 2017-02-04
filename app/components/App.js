import React, { Component } from 'react';
import * as actions from '../actions/index';
import reduxify from '../util/reduxify';

class App extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
        <div ref="App">
          {this.props.children}
        </div>
    );
  }
}

export default App;
