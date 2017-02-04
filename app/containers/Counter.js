import React, { Component } from 'react';
import * as actions from '../actions/index';
import reduxify from '../util/reduxify';

class Counter extends Component {
  constructor(props){
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleCounterChange = this.handleCounterChange.bind(this);
    this.handleDouble = this.handleDouble.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.state = {
      value: 0
    }
  }
  handleValueChange(event){
    this.setState({value: event.target.value})
  }
  handleCounterChange(){
    this.props.action.incrementCounter(this.state.value);
  }
  handleDouble(){
    this.props.action.doubleCounter();
  }
  handleClear(){
    this.props.action.clearCounter();
  }
  render() {
    return (
        <div ref="counter">
          <div>Current Count: {this.props.counter}</div>
          <div>
            <label>
              Value to Add: <input type="text" value={this.state.value} onChange={this.handleValueChange} />
              <button onClick={this.handleCounterChange}>Add to Counter</button>
            </label>
          </div>
          <div><button onClick={this.handleDouble}>Double</button></div>
          <div><button onClick={this.handleClear}>Clear</button></div>

        </div>
    );
  }
}

export default reduxify(actions, ['counter'], Counter);
