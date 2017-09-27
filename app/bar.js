import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import './slider.scss'
import moment from 'moment';

const Handle = Slider.Handle;

const firstTimestamp = moment("2014-01-01 00:00:00").format("X")
const lastTimestamp = moment().format("X")
const defaultTimestamp = moment("2015-05-30 00:00:00").format("X")

export default class Bar extends React.Component {
	constructor(props) {
	    super(props)
		this.updateCurrentTime = this.updateCurrentTime.bind(this)
		this.beforeUpdateSlider = this.beforeUpdateSlider.bind(this)
		this.afterUpdateSlider = this.afterUpdateSlider.bind(this)
	}

	componentWillMount() {
		this.state = { currentDate: moment("2015-05-30 00:00:00").format("YYYY-MM-DD HH:MM")}
	}

	updateCurrentTime(value) {
		this.setState({ currentDate: moment.unix(value).format("YYYY-MM-DD HH:MM")})
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
				<Slider min={parseInt(firstTimestamp)} defaultValue={parseInt(defaultTimestamp)} max={parseInt(lastTimestamp)} onBeforeChange={this.beforeUpdateSlider} onChange={this.updateCurrentTime} onAfterChange={this.afterUpdateSlider} />
			</div>
		);
	}
}