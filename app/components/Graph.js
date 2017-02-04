import React, {Component} from 'react';
import ReactDOM, {render, findDOMNode} from 'react-dom';

class Graph extends Component {
  constructor(props){
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount () {
    this.props.definition(this.refs.graph);
  }
  render () {
    return (<div ref="graph"></div>);
  }
}

Graph.propTypes = {
  definition: React.PropTypes.func.isRequired
}

export default Graph;
