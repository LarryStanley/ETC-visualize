import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import Slider, { Range } from 'rc-slider';
import './slider.scss'

export default class Bar extends React.Component {
	constructor(props) {
	    super(props);
	    console.log('constructor');
	 }
	render() {
		return (
			<div id='bar'>
				<Slider />
			</div>
		);
	}
}