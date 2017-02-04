import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import Counter from '../containers/Counter'
import Graph from './Graph';
import barchart from '../charts/barchart';
import linechart from '../charts/linechart';
import scatterplot from '../charts/scatterplot';
import mapgeo from '../charts/mapgeo';

const Hero = (props) => (
  <div>
    <Counter/>
    <Graph definition={barchart}/>
    <Graph definition={linechart}/>
    <Graph definition={scatterplot}/>
    <Graph definition={mapgeo}/>
  </div>
)

export default Hero;
