import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import './slider.scss'
import moment from 'moment';

const Handle = Slider.Handle;

export default class Bar extends React.Component {
	constructor(props) {
	    super(props)
		this.updateCurrentTime = this.updateCurrentTime.bind(this)
		this.beforeUpdateSlider = this.beforeUpdateSlider.bind(this)
		this.afterUpdateSlider = this.afterUpdateSlider.bind(this)
	}

	componentWillMount() {
	}

	updateCurrentTime(value) {
		this.props.updateCurrentTime(value)
	}

	beforeUpdateSlider(value) {
		this.props.beforeUpdateSlider(value)
	}

	afterUpdateSlider(value) {
		this.props.afterUpdateSlider(value)
	}

	render() {
		return (
			<div id='bar'>
				<Slider
						   min={parseInt(this.props.startPeriodTime)} 
					defaultValue={parseInt(this.props.defaultValue)}
						 value={parseInt(this.props.value)} 
				 		  max={parseInt(this.props.endPeriodTime)} 
			   onBeforeChange={this.beforeUpdateSlider} 
			   		 onChange={this.updateCurrentTime} 
			   	onAfterChange={this.afterUpdateSlider} />
			</div>
		);
	}
}